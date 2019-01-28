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
  async parseArgs (cmd, argsArray, ctx, parsed = {}, pass = 0) {
    if (!argsArray.length) {
      if (!argsArray[pass] && !pass && !cmd.args[pass].default) {
        throw new EclipseError(
          { type: 'friendly' },
          `You did not specify a ${cmd.args[0].name || cmd.args[0].type}`
        )
      } else if (cmd.args[pass] && cmd.args[pass].default) {
        const arg = cmd.args[0]
        parsed[arg.name || arg.type] = await arg.default(ctx)
      }

      return parsed
    } else {
      const arg = cmd.args[pass]

      if (argsArray.length === 0 && arg) {
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
      return this.parseArgs(cmd, argsArray, ctx, parsed, (pass += 1))
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
        `Could not find ${type.substring(0, type.length - 1)}: ${arg}`
      )
    }
    return obj
  }

  // Parses command flags
  async parseFlags (cmd, args, ctx) {
    if (!args[0]) return
    const startsWith = args[0].startsWith('--') || args[0].startsWith('—')
    if (!startsWith) return

    const arg = args[0].substring(2, args[0].length)
    let flag = cmd.flags.get(arg) || cmd.flagAliases.get(arg)
    if (!flag) return true

    this.logger.debug(`[Argument-Parser]: Found flag: ${args[0]}`)
    if (flag.devOnly && !dev(ctx)) return true
    if (!hasPermission(flag)) return true
    args.shift()
    await flag.run(ctx, await this.parseArgs(flag, args, ctx))
    return true
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
