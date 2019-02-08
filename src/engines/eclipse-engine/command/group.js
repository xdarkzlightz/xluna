import { Collection, RichEmbed } from 'discord.js'

import { createGroupHelp } from '@engines/eclipse/util/embed'
import {
  setGroupEnabledTo,
  groupStatus,
  groupShowEnabled,
  clear
} from '@engines/eclipse/core'
import { dev } from '@engines/eclipse/util/other'

class Group {
  constructor (client, path, groupObject) {
    // Eclipse Client
    this.client = client
    this.path = path
    // Copy of the original group object
    this.group = Object.assign({}, groupObject)
    this.config = this.group.GroupConfig

    this.name = this.group.GroupConfig.name
    this.devOnly = this.group.GroupConfig.devOnly
    this.beforeEach = this.group.GroupConfig.beforeEach
    this.description = this.group.GroupConfig.description
    this.parent = this.group.GroupConfig.parent
    this.aliases = this.group.GroupConfig.aliases

    // Collection of the commands that belong to this group
    this.commands = new Collection()
    this.commandAliases = new Collection()

    this.flags = new Collection()
    this.flagAliases = new Collection()

    this.registerDefaultFlags()
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
        run: setGroupEnabledTo,
        memberPermissions: ['ADMINISTRATOR'],
        args: [{ type: 'channel', name: 'arg', default: ctx => ctx.channel }]
      },
      {
        name: `disable-channel`,
        run: setGroupEnabledTo,
        memberPermissions: ['ADMINISTRATOR'],
        args: [{ type: 'channel', name: 'arg', default: ctx => ctx.channel }]
      },
      {
        name: `enable-member`,
        run: setGroupEnabledTo,
        memberPermissions: ['ADMINISTRATOR'],
        args: [{ type: 'member', name: 'arg' }]
      },
      {
        name: `disable-member`,
        run: setGroupEnabledTo,
        memberPermissions: ['ADMINISTRATOR'],
        args: [{ type: 'member', name: 'arg' }]
      },
      {
        name: `enable-role`,
        run: setGroupEnabledTo,
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
        run: setGroupEnabledTo,
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
        run: groupStatus,
        args: [{ type: 'channel', name: 'arg', default: ctx => ctx.channel }]
      },
      {
        name: `status-member`,
        run: groupStatus,
        args: [{ type: 'member', name: 'arg' }]
      },
      {
        name: `status-role`,
        run: groupStatus,
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
        run: ctx => groupShowEnabled(ctx, 'role')
      },
      {
        name: `show-channels`,
        run: ctx => groupShowEnabled(ctx, 'channel')
      },
      {
        name: `show-members`,
        run: ctx => groupShowEnabled(ctx, 'member')
      },
      {
        name: `help`,
        aliases: ['h'],
        run: this.sendHelpMessage
      },
      {
        name: `clear-channel`,
        description: 'Lets you clear the config for a channel',
        usage: 'config --clear-channel (channel)',
        example: 'config --clear-channel general',
        run: clear,
        args: [{ type: 'channel', name: 'arg', default: ctx => ctx.channel }]
      },
      {
        name: `clear-member`,
        description: 'Lets you clear the config for a member',
        usage: 'config --clear-member (member)',
        example: 'config --clear-member xdarkzlightz',
        run: clear,
        args: [{ type: 'member', name: 'arg' }]
      },
      {
        name: `clear-role`,
        description: 'Lets you clear the config for a role',
        usage: 'config --clear-role (role)',
        example: 'config --clear-role role',
        run: clear,
        args: [
          {
            type: 'role',
            name: 'arg',
            default: ctx => ctx.everyone
          }
        ]
      },
      {
        name: `reload`,
        devOnly: true,
        run: ctx => this.reload(ctx)
      },
      {
        name: `unload`,
        devOnly: true,
        run: this.unload
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
    ctx.ssuccess(unloaded)
  }

  sendHelpMessage (ctx) {
    const embed = new RichEmbed().setColor(0x4286f4)
    createGroupHelp(ctx.prefix, ctx, embed)
    ctx.say(embed)
  }

  createSchema (rating) {
    let commands = []
    this.commands.array().forEach(cmd => {
      if (cmd.devOnly) return
      commands.push(cmd.createSchema(rating))
    })
    return {
      name: this.name,
      commands
    }
  }
}
export default Group
