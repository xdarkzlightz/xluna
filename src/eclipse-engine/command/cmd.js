import { Collection } from 'discord.js'

import { setEnabledTo, status } from '@eclipse/database'

class Command {
  constructor (Client, commandObject) {
    this.client = Client

    this.command = Object.assign({}, commandObject)

    this.name = this.command.config.name
    this.group = Client.registry.groups.get(this.command.config.group)

    this.args = this.command.config.args
    this.devOnly = this.command.config.devOnly
    this.rating = this.command.config.rating

    this.flags = new Collection()
    this.flagAliases = new Collection()

    this.registerDefaultFlags()
  }

  run (ctx, args) {
    if (this.group.beforeEach) {
      ctx.beforeEachVal = this.group.beforeEach(ctx)
    }

    // Currently not needed, however if needed in the future simply uncomment line below
    // this.command.run.call(this, ctx, args)
    this.command.run(ctx, args)
  }

  registerFlag (flag) {
    if (flag.arg) {
      if (!flag.arg.name) flag.arg.name = flag.arg.type
    }

    this.flags.set(flag.name, flag)

    if (flag.aliases) {
      flag.aliases.forEach(alias => {
        if (this.flagAliases.has(alias)) {
          this.client.logger.info(
            `Could not add flag alias ${alias}, a flag with the name of ${alias} already exists`
          )
        }
        this.flagAliases.set(alias, flag)
      })
    }
  }

  registerFlags (flags) {
    flags.forEach(flag => {
      this.registerFlag(flag)
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
      },
      {
        name: `reload`,
        devOnly: true,
        run: this.reload
      },
      {
        name: `unload`,
        devOnly: true,
        run: this.unload
      }
    ])
  }

  reload (ctx) {
    if (ctx.client.devs.indexOf(ctx.author.id) === -1) return

    const reloaded = ctx.client.registry.reloadCommand(ctx.cmd)
    ctx.success(reloaded)
  }

  unload (ctx) {
    if (ctx.client.devs.indexOf(ctx.author.id) === -1) return

    const unloaded = ctx.client.registry.unloadCommand(ctx.cmd)
    ctx.success(unloaded)
  }

  createSchema (guildRating) {
    return {
      name: this.name,
      enabled: this.rating <= guildRating
    }
  }
}

export default Command
