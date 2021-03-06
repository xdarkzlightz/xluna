import EclipseError from '@engines/eclipse/error/EclipseError'
import { hasPermission, dev } from '../util/other'

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
  async parseArgs (cmd, ctx, parsed = {}, pass = 0) {
    if (!ctx.args.length || !cmd.args[pass]) {
      if (cmd.args && cmd.args[pass] && !cmd.args[pass].default) {
        throw new EclipseError(
          { type: 'friendly' },
          `You did not specify a ${cmd.args[pass].name || cmd.args[pass].type}`
        )
      } else if (cmd.args && cmd.args[pass] && cmd.args[pass].default) {
        const arg = cmd.args[0]
        parsed[arg.name || arg.type] = await arg.default(ctx)
      }

      return parsed
    } else {
      const arg = cmd.args[pass]

      if (ctx.args.length === 0 && arg) {
        throw new EclipseError(
          { type: 'friendly' },
          `You did not specify a ${arg.name}`
        )
      }

      let obj = this.isPrimitive(arg.type)
        ? this.parsePrimitives(arg.type, ctx.args[0])
        : await this.parseDiscordTypes(arg.type, ctx.args[0], ctx)

      if (arg.options) {
        const foundValue = arg.options.find(val => obj.toLowerCase() === val)
        if (!foundValue) {
          throw new EclipseError(
            { type: 'friendly', options: arg.options },
            `Invalid option: ${obj}`
          )
        }
      }

      if (arg.type === 'string' && ctx.args[pass + 1] && !cmd.args[pass + 1]) {
        obj = ctx.args.join(' ')
      }

      parsed[arg.name || arg.type] = obj

      ctx.args.shift()
      return this.parseArgs(cmd, ctx, parsed, (pass += 1))
    }
  }

  // Parses a primitve from an argument
  parsePrimitives (type, arg) {
    if (type === 'string') return arg
    if (type === 'number') {
      const num = parseInt(arg, 10)
      if (!isNaN(num)) return num
      throw new EclipseError(
        { type: 'friendly' },
        `Value provided is not a number`
      )
    } else if (type === 'boolean') return arg === 'true'
  }

  // Returns a eclipse type from an argument
  async parseDiscordTypes (type, arg, ctx) {
    const cbs = {
      role: r => r.id === arg || r.name === arg,
      member: m =>
        m.id === arg || m.user.username === arg || m.user.tag === arg,
      channel: c => c.id === arg || c.name === arg
    }

    let obj = ctx.guild[`${type}s`].find(cbs[type])
    if (!obj) obj = ctx.msg.mentions[`${type}s`].first()
    if (!obj) {
      throw new EclipseError(
        { type: 'friendly' },
        `Could not find ${type}: ${arg}`
      )
    }
    let db = ctx.guild.db[`${type}s`].get(obj.id)
    if (!db) db = ctx.guild.db.add(type, { id: obj.id })
    obj.db = db

    return obj
  }

  // Parses command flags
  async parseFlags (ctx) {
    let flag
    if (ctx.cmd) flag = this.parseFlag(ctx.cmd, ctx)
    if (!flag) flag = this.parseFlag(ctx.group, ctx)
    return flag
  }

  async parseFlag (obj, ctx) {
    const args = ctx.args
    if (!args[0]) return
    const startsWith = args[0].startsWith('--') || args[0].startsWith('—')
    if (!startsWith) return

    const arg = args[0].substring(2, args[0].length)
    let flag = obj.flags.get(arg) || obj.flagAliases.get(arg)
    if (!flag) return true

    this.logger.debug(`[Argument-Parser]: Found flag: ${args[0]}`)
    if (flag.devOnly && !dev(ctx)) return true
    if (!hasPermission(flag, ctx)) return true
    args.shift()
    await flag.run(ctx, await this.parseArgs(flag, ctx))
    return true
  }

  // Borrowed from https://github.com/Shinobu1337/discord-command-parser/
  // Regexp for getting an argument array from a string
  getArgs (str) {
    const matchArgs = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g
    const quoteStrip = /^"|"$|^'|'$|^```(\S*\n?)|```$/g

    let splitted = str.match(matchArgs)
    if (!splitted) return []
    return splitted.map(v => v.replace(quoteStrip, ''))
  }
}
export default ArgumentParser
