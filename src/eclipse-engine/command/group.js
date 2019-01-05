import { Collection, RichEmbed } from 'discord.js'

import { success, colours, images, error } from '@eclipse/util/embed'
import { findID, findName } from '@eclipse/util/array'

class Group {
  constructor (client, path, groupObject) {
    // Eclipse Client
    this.client = client
    this.path = path
    // Copy of the original group object
    this.group = Object.assign({}, groupObject)
    this.name = this.group.GroupConfig.name
    this.devOnly = this.group.GroupConfig.devOnly

    // Collection of the commands that belong to this group
    this.commands = new Collection()
  }

  /**
   * Updates the command inside of the guild database
   * @param  {String}      target Which part of the database you're targeting
   * @param  {EclipseType} val    What you want to update inside of the database
   * @param  {Boolean}     enable If the command should be enabled or disabled
   * @return {Promise}            The save function
   */
  async updateDB (target, val, enable) {
    let db = await val.getDB()
    let targetDB = findID(db[`${target}s`], val.id)
    if (!targetDB) {
      await val.newEntry()
      db = await val.getDB()
      targetDB = findID(db[`${target}s`], val.id)
    }
    const group = findName(targetDB.groups, this.name)
    group.commands.forEach(command => {
      command.enabled = enable
    })

    await db.save()
  }

  async enable (val, ctx, target) {
    const name = val.user ? val.user.name : val.name
    await this.updateDB(target, val, true)
    ctx.say(success(`Group: ${this.name} enabled for ${name}!`))

    return true
  }

  async disable (val, ctx, target) {
    const name = val.member ? val.member.user.tag : val.name
    await this.updateDB(target, val, false)
    ctx.say(success(`Group: ${this.name} disabled for ${name}!`))
    return true
  }

  async status (val, ctx, target) {
    const name = val.user ? val.user.name : val.name
    const richEmbed = new RichEmbed()
      .setColor(colours.success)
      .setAuthor(`Here is the current config for ${name}`, images.checkmark)

    let db = await val.getFromDB()
    if (!db) {
      return ctx.say(error({ message: `Config not found for ${name}!` }))
    }

    const group = findName(db.groups, this.name)

    let enabledString = ''
    group.commands.forEach(cmd => {
      const msg = cmd.enabled ? 'enabled' : 'disabled'
      enabledString += `${cmd.name}: ${msg}\n`
    })
    richEmbed.addField(`${this.name} commands`, enabledString)
    ctx.say(richEmbed)
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

  createSchema (rating) {
    let commands = []
    this.commands.array().forEach(cmd => {
      commands.push(cmd.createSchema(rating))
    })
    return {
      name: this.name,
      commands
    }
  }
}
export default Group
