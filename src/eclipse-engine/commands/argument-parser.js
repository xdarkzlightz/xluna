const util = require('../util/util')
const embed = require('../util/embed-util')
const Role = require('../extensions/role')
const Member = require('../extensions/member')
const Channel = require('../extensions/channel')

class ArgumentParser {
  constructor (client) {
    this.client = client
  }

  // Checks if the value passed a primitive value
  isPrimitive (val) {
    return val === 'string' || val === 'number' || val === 'boolean'
  }

  // Parses args from an argument array
  async parseArgs (cmd, argsArray, ctx) {
    if (argsArray.length === 0) {
      if (cmd.args[0]) {
        return {
          error: {
            type: `Missing argument`,
            message: `Missing argument ${cmd.args[0].name}`
          }
        }
      } else {
        return {}
      }
    }
    const args = this.getArgs(argsArray.join(' '))
    let parsedArgs = { values: {} }
    let x = 0
    await util.asyncForEach(cmd.args, async arg => {
      if (parsedArgs.error) return
      if (!args[x]) {
        return (parsedArgs.error = {
          type: `Missing argument`,
          message: `Missing argument ${cmd.args[0].name}`
        })
      }

      const obj = this.isPrimitive(arg.type)
        ? this.parsePrimitives(arg.type, args[x])
        : await this.parseDiscordTypes(arg.type, args[x], ctx)

      if (obj.error) {
        parsedArgs.error = obj.error
        return x++
      } else if (obj.value) {
        if (arg.values) {
          const foundValue = arg.values.find(
            val => obj.value.toLowerCase() === val
          )
          if (!foundValue) {
            parsedArgs.error = {
              type: `Invalid argument value`,
              message: `Invalid argument: ${obj.value}`,
              values: arg.values
            }
          }
        }
        parsedArgs.values[arg.name] = obj.value
        return x++
      }
    })

    return parsedArgs
  }

  // Parses a primitve from an argument
  parsePrimitives (type, arg) {
    let parsedPrimitive = {}
    if (type === 'string') {
      parsedPrimitive.value = arg
    } else if (type === 'number') {
      let num = parseInt(arg, 10)
      if (!isNaN(num)) {
        parsedPrimitive.value = num
      } else {
        parsedPrimitive.error = {
          type: `Invalid value`,
          message: 'Value provided is not a number'
        }
      }
    } else if (type === 'boolean') {
      parsedPrimitive.value = arg === 'true'
    }
    return parsedPrimitive
  }

  // Returns a eclipse type from an argument
  async parseDiscordTypes (type, arg, ctx) {
    if (type === 'user') {
      let parsedDiscordType = {}
      const user = await this.client.fetchUser(arg)
      if (user) {
        parsedDiscordType.value = user
      } else {
        parsedDiscordType.error = {
          type: `Invalid user`,
          message: 'Could not find user'
        }
      }
      return parsedDiscordType
    } else if (type === 'member') {
      const type = await this.findDiscordType(
        'members',
        arg,
        ctx,
        member =>
          member.id === arg ||
          member.user.username === arg ||
          member.user.tag === arg
      )
      if (!type.error) type.value = new Member(this.client, type.value)
      return type
    } else if (type === 'role') {
      const type = await this.findDiscordType(
        'roles',
        arg,
        ctx,
        role => role.id === arg || role.name === arg
      )
      if (!type.error) type.value = new Role(this.client, type.value)
      return type
    } else if (type === 'channel') {
      const type = await this.findDiscordType(
        'channels',
        arg,
        ctx,
        channel => channel.id === arg || channel.name === arg
      )
      if (!type.error) {
        type.value = new Channel(this.client, type.value)
      }
      return type
    }
  }

  // Parses a discord type from an argument
  async findDiscordType (type, arg, ctx, callback) {
    let returnVal = {}
    let obj = await ctx.guild[type].find(val => callback(val))
    if (!obj) obj = ctx.msg.mentions[type].first()
    if (obj) {
      returnVal.value = obj
    } else {
      returnVal.error = {
        type: `Invalid argument`,
        message: `Could not find ${type.substring(0, type.length - 1)}`
      }
    }
    return returnVal
  }

  // Parses command flags
  async parseFlags (cmd, args, ctx) {
    const flag = this.checkForFlags(args)
    if (!flag) return
    const member = ctx.member.obj
    if (!member.hasPermission('ADMINISTRATOR')) return true

    const rawSplit = flag.split('-')
    const [action, target] = rawSplit.slice(2, 4)

    const runArgs = [args, flag, ctx, cmd]
    if (action === 'reload') {
      return cmd.reload(ctx)
    } else if (action === 'unload') {
      return cmd.unload(ctx)
    } else if (target === 'everyone') {
      return cmd[action](ctx.everyone, ctx, 'role')
    } else {
      return this.runFlag(target, action, ...runArgs)
    }
  }

  // Runs a command flag
  async runFlag (type, action, args, flag, ctx, cmd) {
    const pos = args.indexOf(flag)
    let obj
    if (!args[pos + 1]) {
      if (type === 'channel') {
        obj = { value: ctx.channel }
      } else {
        ctx.say(
          embed.error({
            type: 'Missing argument',
            message: `Missing ${type} argument`
          })
        )
        return true
      }
    } else {
      obj = await this.parseDiscordTypes(type, args[pos + 1], ctx)
    }

    if (!obj.error) {
      cmd[action](obj.value, ctx, type)
    } else {
      ctx.say(embed.error(obj.error))
    }
    return true
  }

  // Checks for command flags
  checkForFlags (args) {
    return args.find(
      arg =>
        arg === '--reload' ||
        arg === '--unload' ||
        arg === '--enable-member' ||
        arg === '--enable-channel' ||
        arg === '--enable-role' ||
        arg === '--enable-everyone' ||
        arg === '--enable-global' ||
        arg === '--disable-member' ||
        arg === '--disable-channel' ||
        arg === '--disable-role' ||
        arg === '--disable-everyone' ||
        arg === '--disable-global' ||
        arg === '--clear-member' ||
        arg === '--clear-channel' ||
        arg === '--clear-role' ||
        arg === '--status-member' ||
        arg === '--status-channel' ||
        arg === '--status-role' ||
        arg === '--status-everyone'
    )
  }

  // Borrowed from https://github.com/Shinobu1337/discord-command-parser/
  // Regexp for getting an argument array from a string
  getArgs (str) {
    const matchArgs = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g
    const quoteStrip = /^"|"$|^'|'$|^```(\S*\n?)|```$/g

    let splitted = str.match(matchArgs)
    return splitted.map(v => v.replace(quoteStrip, ''))
  }
}
module.exports = ArgumentParser
