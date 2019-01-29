import { Collection } from 'discord.js'

class Base {
  constructor (data, guild) {
    this.guild = guild
    this.provider = guild.provider

    this.data = data

    this.groups = new Collection()
    this.commands = new Collection()

    this.init()
  }

  /** Caches the groups and commands from this objects data */
  init () {
    this.data.groups.forEach(group => {
      this.groups.set(group.name, group)
      group.commands.forEach(c => this.commands.set(c.name, c))
    })
  }

  /** Shortcut to save the guild data */
  async save (ctx) {
    await this.guild.save(ctx)
  }

  /** Removes the groups from this objects data */
  removeGroups () {
    this.data.groups = []
    this.groups.clear()
    this.commands.clear()
  }

  /** Copies the everyone roles group data and then caches it */
  addGroups () {
    this.data.groups = this.guild.roles.get(this.guild.data.id).data.groups
    this.init()
  }
}

export default Base
