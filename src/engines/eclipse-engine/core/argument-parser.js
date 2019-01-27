import EclipseError from '@engines/eclipse/error/EclipseError'

/*
  Add clear and status command flags
*/
class ArgumentParser {
  constructor (client) {
    this.client = client
    this.logger = client.logger
  }

  // Checks if the value passed a primitive value
  isPrimitive (val) {
    return val === 'string' || val === 'number' || val === 'boolean'
  }

  // Parses args from an argument array
  async parseArgs (cmd, argsArray, ctx, parsed = {}, pass = 0) {
    if (!argsArray.length) {
      return parsed
    } else {
      const arg = cmd.args[pass]

      if (argsArray.length === 0 && arg) {
        throw new EclipseError(
          { type: 'friendly' },
          `You did not specify a ${arg.name}`
        )
      }

      if (!argsArray[pass]) {
        throw new EclipseError(
          { type: 'friendly' },
          `You did not specify a ${arg.name}`
        )
      }

      const args = this.getArgs(argsArray.join(' '))
      const obj = this.isPrimitive(arg.type)
        ? this.parsePrimitives(arg.type, args[pass])
        : await this.parseDiscordTypes(arg.type, args[pass], ctx)

      if (arg.values) {
        const foundValue = arg.values.find(val => obj.toLowerCase() === val)
        if (!foundValue) {
          throw new EclipseError(
            { type: 'friendly', defaults: arg.values },
            `Invalid argument: ${obj}`
          )
        }
      }

      parsed[arg.name] = obj

      argsArray.shift()
      return this.parseArgs(cmd, argsArray, ctx, parsed, pass++)
    }
  }

  // Parses a primitve from an argument
  parsePrimitives (type, arg) {
    let parsedPrimitive
    if (type === 'string') {
      parsedPrimitive = arg
    } else if (type === 'number') {
      let num = parseInt(arg, 10)
      if (!isNaN(num)) {
        parsedPrimitive = num
      } else {
        throw new EclipseError(
          { type: 'friendly' },
          `Value provided is not a number`
        )
      }
    } else if (type === 'boolean') {
      parsedPrimitive = arg === 'true'
    }
    return parsedPrimitive
  }

  // Returns a eclipse type from an argument
  async parseDiscordTypes (type, arg, ctx) {
    if (type === 'member') {
      const type = await this.findDiscordType(
        'members',
        arg,
        ctx,
        member =>
          member.id === arg ||
          member.user.username === arg ||
          member.user.tag === arg
      )
      return type
    } else if (type === 'role') {
      const type = await this.findDiscordType(
        'roles',
        arg,
        ctx,
        role => role.id === arg || role.name === arg
      )
      return type
    } else if (type === 'channel') {
      const type = await this.findDiscordType(
        'channels',
        arg,
        ctx,
        channel => channel.id === arg || channel.name === arg
      )
      return type
    }
  }

  // Parses a discord type from an argument
  async findDiscordType (type, arg, ctx, callback) {
    let obj = await ctx.guild[type].find(val => callback(val))
    if (!obj) obj = ctx.msg.mentions[type].first()
    if (!obj) {
      throw new EclipseError(
        { type: 'friendly' },
        `Could not find ${type.substring(0, type.length - 1)}: ${arg}`
      )
    }
    return obj
  }

  // Parses command flags
  async parseFlags (cmd, args, ctx) {
    this.logger.debug(`[Argument-Parser]: Parsing flag: ${args[0]}`)

    if (!args[0] || !args[0].startsWith('--')) return
    let flag = cmd.flags.get(args[0].substring(2, args[0].length))
    if (!flag) flag = cmd.flagAliases.get(args[0].substring(2, args[0].length))
    if (!flag) return true

    this.logger.debug(`[Argument-Parser]: Found flag: ${args[0]}`)
    if (flag.devOnly && ctx.client.devs.indexOf(ctx.author.id) === -1) return

    if (flag.memberPermissions) {
      let err
      flag.memberPermissions.forEach(perm => {
        if (err) return
        if (!ctx.member.hasPermission(perm)) {
          err = true
          return ctx.error(
            `Could not run flag! You're missing permission: ${perm.toLowerCase()}`
          )
        }
      })
      if (err) return true
    }

    return this.runFlag(flag, ctx, args)
  }

  // Runs a command flag
  async runFlag (flag, ctx, args) {
    let obj = {}
    if (flag.arg) obj = await this.parseFlagArgs(flag, ctx, args)
    if (flag.args) {
      args.shift()
      obj = await this.parseArgs(flag, args, ctx)
    }
    if (obj === true) return obj

    await flag.run(ctx, obj)
    return true
  }

  async parseFlagArgs (flag, ctx, args) {
    args = this.getArgs(args.join(' '))

    let arg = args[1]
    if (!arg) {
      if (flag.default) {
        this.logger.debug('[Argument-Parser]: Resorting to default value')
        return flag.default(ctx)
      } else {
        ctx.error(`Missing ${flag.arg.name} argument`)
        return true
      }
    } else if (!flag.args) {
      this.logger.debug(
        `[Argument-Parser]: Parsing discord type for ${flag.arg.type}`
      )
      if (
        flag.arg.type === 'channel' ||
        flag.arg.type === 'member' ||
        flag.arg.type === 'role'
      ) {
        return this.parseDiscordTypes(flag.arg.type, arg, ctx)
      } else {
        return this.parsePrimitives(flag.arg.type, arg)
      }
    }
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
export default ArgumentParser
