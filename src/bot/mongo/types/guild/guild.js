import { Collection } from 'discord.js'
import { findID, removeFromArray } from '@util/array'

import Role from './role'
import Channel from './channel'
import Member from './member'

class mongoGuild {
  constructor (guild, provider) {
    this.provider = provider
    this.data = guild

    this.config = guild.config
    this.rating = guild.config.rating

    this.roles = new Collection()
    this.channels = new Collection()
    this.members = new Collection()

    this.saving = false

    this.init()
  }

  /** Caches all the roles, channels, and members from the guild data */
  init () {
    this.data.roles.forEach(r => this.cache('role', r))
    this.data.channels.forEach(c => this.cache('channel', c))
    this.data.members.forEach(m => this.cache('member', m))
  }

  /** Saves the guild data
   * If you pass a CTX object it'll update the guild, channel, member, and everyone objects
   */
  async save (ctx) {
    this.saving = true
    await this.data.save()
    this.saving = false

    if (ctx && ctx.guild) {
      ctx.guild.db = this
      ctx.channel.db = this.channels.get(ctx.channel.id)
      ctx.member.db = this.members.get(ctx.member.id)
      ctx.everyone.db = this.roles.get(ctx.guild.id)
    }
  }

  /** Adds a member, role, or channel data object to the database and then caches it */
  add (type, obj) {
    this.data[`${type}s`].push(obj)
    const data = findID(this.data[`${type}s`], obj.id)
    return this.cache(type, data)
  }

  /** Removes a data object from the guild data */
  remove (type, id) {
    const obj = this[`${type}s`].get(id)
    removeFromArray(this.data[`${type}s`], obj.data)
  }

  /** Caches a member, role, or channel data object and returns the reference to the object */
  cache (type, data) {
    const set = _data => this[`${type}s`].set(data.id, _data)

    if (type === 'member') set(new Member(data, this))
    if (type === 'role') set(new Role(data, this))
    if (type === 'channel') set(new Channel(data, this))

    return this[`${type}s`].get(data.id)
  }
}

export default mongoGuild
