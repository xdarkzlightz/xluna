import { Collection, RichEmbed } from 'discord.js'

import { success, generateGroupHelp } from '@eclipse/util/embed'
import { setGroupEnabledTo, groupStatus } from '@eclipse/core'

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
        arg: { type: 'channel' },
        default: ctx => {
          return ctx.channel
        }
      },
      {
        name: `disable-channel`,
        run: setGroupEnabledTo,
        arg: { type: 'channel' },
        default: ctx => {
          return ctx.channel
        }
      },
      {
        name: `enable-member`,
        run: setGroupEnabledTo,
        arg: { type: 'member' }
      },
      {
        name: `disable-member`,
        run: setGroupEnabledTo,
        arg: { type: 'member' }
      },
      {
        name: `enable-role`,
        run: setGroupEnabledTo,
        arg: { type: 'role' },
        default: ctx => {
          return ctx.guild.roles.get(ctx.guild.id)
        }
      },
      {
        name: `disable-role`,
        run: setGroupEnabledTo,
        arg: { type: 'role' },
        default: ctx => {
          return ctx.guild.roles.get(ctx.guild.id)
        }
      },
      {
        name: `status-channel`,
        run: groupStatus,
        arg: { type: 'channel' },
        default: ctx => {
          return ctx.channel
        }
      },
      {
        name: `status-member`,
        run: groupStatus,
        arg: { type: 'member' }
      },
      {
        name: `status-role`,
        run: groupStatus,
        arg: { type: 'role' },
        default: ctx => {
          return ctx.guild.roles.get(ctx.guild.id)
        }
      },
      {
        name: `help`,
        aliases: ['h'],
        run: this.sendHelpMessage
      }
    ])
  }

  reload (ctx) {
    if (this.client.devs.indexOf(ctx.author.id) >= 0) return

    const reloaded = this.client.registry.reloadGroup(this)
    ctx.say(success(reloaded))
  }

  unload (ctx) {
    if (this.client.devs.indexOf(ctx.author.id) >= 0) return

    const unloaded = this.client.registry.unloadGroup(this)
    ctx.say(success(unloaded))
  }

  sendHelpMessage (ctx) {
    const embed = new RichEmbed().setColor(0x4286f4)
    generateGroupHelp(ctx, embed)
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
