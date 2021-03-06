import { Collection, RichEmbed } from 'discord.js'

import {
  setCommandEnabledTo,
  commandStatus,
  showEnabled
} from '@engines/eclipse/core'
import { createCommandHelp } from '@engines/eclipse/util/embed'
import Flag from './flag'
import { dev } from '@engines/eclipse/util/other'

class Command {
  constructor (Client, commandObject) {
    this.client = Client

    this.command = Object.assign({}, commandObject)

    this.name = this.command.config.name
    this.group = Client.registry.groups.get(this.command.config.group)

    this.args = this.command.config.args
    this.devOnly = this.command.config.devOnly
    this.rating = this.command.config.rating
    this.aliases = this.command.config.aliases
    this.description = this.command.config.description
    this.usage = this.command.config.usage
    this.example = this.command.config.example
    this.nsfw = this.command.config.nsfw
    this.clientPermissions = this.command.config.clientPermissions
    this.memberPermissions = this.command.config.memberPermissions
    this.cooldown = this.command.config.cooldown
    this.cannotDisable = this.command.config.cannotDisable

    this.flags = new Collection()
    this.flagAliases = new Collection()
    this.registerDefaultFlags()

    this.userCooldowns = new Collection()
    this.messageCooldowns = new Collection()
    this.strikes = new Collection()
  }

  run (ctx, args) {
    if (this.group.beforeEach) {
      ctx.beforeEachVal = this.group.beforeEach(ctx)
    }
    this.command.run(ctx, args)
  }

  registerFlag (flag) {
    this.flags.set(flag.name, new Flag(flag.name, flag))

    if (flag.aliases) {
      flag.aliases.forEach(alias => {
        if (this.flagAliases.has(alias)) {
          this.client.logger.info(
            `Could not add flag alias ${alias}, a flag with the name of ${alias} already exists`
          )
        }
        this.flagAliases.set(alias, new Flag(flag.name, flag))
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
        memberPermissions: ['ADMINISTRATOR'],
        run: setCommandEnabledTo,
        args: [{ type: 'channel', name: 'arg', default: ctx => ctx.channel }]
      },
      {
        name: `disable-channel`,
        run: setCommandEnabledTo,
        memberPermissions: ['ADMINISTRATOR'],
        args: [{ type: 'channel', name: 'arg', default: ctx => ctx.channel }]
      },
      {
        name: `enable-member`,
        run: setCommandEnabledTo,
        memberPermissions: ['ADMINISTRATOR'],
        args: [{ type: 'member', name: 'arg' }]
      },
      {
        name: `disable-member`,
        run: setCommandEnabledTo,
        memberPermissions: ['ADMINISTRATOR'],
        args: [{ type: 'member', name: 'arg' }]
      },
      {
        name: `enable-role`,
        run: setCommandEnabledTo,
        memberPermissions: ['ADMINISTRATOR'],
        args: [
          {
            type: 'role',
            name: 'arg',
            default: ctx => ctx.everyone
          }
        ]
      },
      {
        name: `disable-role`,
        run: setCommandEnabledTo,
        memberPermissions: ['ADMINISTRATOR'],
        args: [
          {
            type: 'role',
            name: 'arg',
            default: ctx => ctx.everyone
          }
        ]
      },
      {
        name: `status-channel`,
        run: commandStatus,
        args: [{ type: 'channel', name: 'arg', default: ctx => ctx.channel }]
      },
      {
        name: `status-member`,
        run: commandStatus,
        args: [{ type: 'member', name: 'arg' }]
      },
      {
        name: `status-role`,
        run: commandStatus,
        args: [
          {
            type: 'role',
            name: 'arg',
            default: ctx => ctx.everyone
          }
        ]
      },
      {
        name: `show-roles`,
        run: ctx => showEnabled(ctx, 'role')
      },
      {
        name: `show-channels`,
        run: ctx => showEnabled(ctx, 'channel')
      },
      {
        name: `show-members`,
        run: ctx => showEnabled(ctx, 'member')
      },
      {
        name: `reload`,
        devOnly: true,
        run: ctx => this.reload(ctx)
      },
      {
        name: `unload`,
        devOnly: true,
        run: ctx => this.unload(ctx)
      },
      {
        name: `help`,
        aliases: ['h'],
        run: this.sendHelpMessage
      }
    ])
  }

  reload (ctx) {
    if (!dev(ctx)) return

    const reloaded = ctx.client.registry.reloadGroup(this)
    ctx.success(reloaded)
  }

  unload (ctx) {
    if (!dev(ctx)) return

    const unloaded = ctx.client.registry.unloadGroup(this)
    ctx.success(unloaded)
  }

  sendHelpMessage (ctx) {
    const embed = new RichEmbed().setColor(0x4286f4)
    createCommandHelp(ctx, embed)
    ctx.say(embed)
  }

  createSchema (guildRating) {
    return {
      name: this.name,
      enabled: this.rating <= guildRating
    }
  }
}

export default Command
