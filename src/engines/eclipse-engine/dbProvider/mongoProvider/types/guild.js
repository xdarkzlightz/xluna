import { Collection } from 'discord.js'

import Role from './role'
import Channel from './channel'
import Member from './member'

class mongoGuild {
  constructor (guild) {
    this.data = guild

    this.config = guild.config
    this.rating = guild.config.rating

    this.roles = new Collection()
    this.channels = new Collection()
    this.members = new Collection()

    this.init()
  }

  init () {
    this.data.roles.forEach(r => this.roles.set(r.id, new Role(r)))
    this.data.channels.forEach(c => this.channels.set(c.id, new Channel(c)))
    this.data.members.forEach(m => this.members.set(m.id, new Member(m)))
  }
}

export default mongoGuild
