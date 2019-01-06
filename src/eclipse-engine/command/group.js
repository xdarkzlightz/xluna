import { Collection, RichEmbed } from 'discord.js'

import { success, generateGroupHelp } from '@eclipse/util/embed'

class Group {
  constructor (client, path, groupObject) {
    // Eclipse Client
    this.client = client
    this.path = path
    // Copy of the original group object
    this.group = Object.assign({}, groupObject)

    this.name = this.group.GroupConfig.name
    this.devOnly = this.group.GroupConfig.devOnly
    this.beforeEach = this.group.GroupConfig.beforeEach
    this.description = this.group.GroupConfig.description

    // Collection of the commands that belong to this group
    this.commands = new Collection()

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
