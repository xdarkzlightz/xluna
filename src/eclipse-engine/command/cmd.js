import { Collection } from 'discord.js'

import { setEnabledTo, status } from '@eclipse/database'

class Command {
  constructor (Client, commandObject) {
    this.client = Client

    this.command = Object.assign({}, commandObject)

    this.name = this.command.config.name
    this.group = this.command.config.group
    this.args = this.command.config.args

    this.devOnly = this.command.config.devOnly

    this.rating = this.command.config.rating

    this.flags = new Collection()
    this.registerDefaultFlags()
  }

  run (ctx, args) {
    // Currently not needed, however if needed in the future simply uncomment line below
    // this.command.run.call(this, ctx, args)
    this.command.run(ctx, args)
  }

  registerFlag (flagName, flag) {
    if (!flag.arg.name) flag.arg.name = flag.arg.type
    this.flags.set(flagName, flag)
  }

  registerFlags (flags) {
    flags.forEach(flag => {
      this.registerFlag(flag.name, flag)
    })
  }

  registerDefaultFlags () {
    this.registerFlags([
      {
        name: `enable-channel`,
        run: setEnabledTo,
        arg: { type: 'channel' },
        default: ctx => {
          return ctx.channel
        }
      },
      {
        name: `disable-channel`,
        run: setEnabledTo,
        arg: { type: 'channel' },
        default: ctx => {
          return ctx.channel
        }
      },
      {
        name: `enable-member`,
        run: setEnabledTo,
        arg: { type: 'member' }
      },
      {
        name: `disable-member`,
        run: setEnabledTo,
        arg: { type: 'member' }
      },
      {
        name: `enable-role`,
        run: setEnabledTo,
        arg: { type: 'role' },
        default: ctx => {
          return ctx.guild.roles.get(ctx.guild.id)
        }
      },
      {
        name: `disable-role`,
        run: setEnabledTo,
        arg: { type: 'role' },
        default: ctx => {
          return ctx.guild.roles.get(ctx.guild.id)
        }
      },
      {
        name: `status-channel`,
        run: status,
        arg: { type: 'channel' },
        default: ctx => {
          return ctx.channel
        }
      },
      {
        name: `status-member`,
        run: status,
        arg: { type: 'member' }
      },
      {
        name: `status-role`,
        run: status,
        arg: { type: 'role' },
        default: ctx => {
          return ctx.guild.roles.get(ctx.guild.id)
        }
      }
    ])
  }

  // reload (ctx) {
  //   if (this.client.devs.indexOf(ctx.author.id) >= 0) return

  //   const reloaded = this.client.registry.reloadCommand(this)
  //   ctx.say(success(reloaded))
  //   return true
  // }

  // unload (ctx) {
  //   if (this.client.devs.indexOf(ctx.author.id) >= 0) return

  //   const unloaded = this.client.registry.unloadCommand(this)
  //   ctx.say(success(unloaded))
  //   return true
  // }

  createSchema (guildRating) {
    return {
      name: this.name,
      enabled: this.rating <= guildRating
    }
  }
}

export default Command
