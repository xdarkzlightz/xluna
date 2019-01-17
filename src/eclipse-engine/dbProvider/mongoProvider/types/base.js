import { Collection } from 'discord.js'

class Base {
  constructor (data) {
    this.data = data

    this.groups = new Collection()
    this.commands = new Collection()

    this.init()
  }

  init () {
    this.data.groups.forEach(group => {
      this.groups.set(group.name, group)
      group.commands.forEach(c => this.commands.set(c.name, c))
    })
  }
}

export default Base
