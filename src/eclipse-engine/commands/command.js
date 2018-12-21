const embed = require('../util/embed-util')
const util = require('../util/util')

class Command {
  constructor (Client, commandObject) {
    this.client = Client
    this.command = Object.assign({}, commandObject)

    this.name = this.command.config.name
    this.group = this.command.config.group
    this.args = this.command.config.args

    this.devOnly = this.command.config.devOnly

    this.rating = this.command.config.rating
  }

  run (ctx, args) {
    this.command.run.call(this, ctx, args)
  }

  getCommandFromDB (target, val, db) {
    const dbTarget = util.findID(db[`${target}s`], val.id)
    if (!dbTarget) return undefined
    const group = util.findName(dbTarget.groups, this.group)
    const command = util.findName(group.commands, this.name)
    return command
  }

  enabled (target, val, db) {
    const cmd = this.getCommandFromDB(target, val, db)
    if (!cmd) return undefined
    return cmd.enabled
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
    let targetDB = util.findID(db[`${target}s`], val.id)

    if (!targetDB) {
      await val.newEntry()
      db = await val.getDB()
      targetDB = util.findID(db[`${target}s`], val.id)
    }

    const group = util.findName(targetDB.groups, this.group)
    const command = util.findName(group.commands, this.name)

    command.enabled = enable

    await db.save()
  }

  async clear (val, ctx) {
    if (this.name !== 'config') return true
    if (val.name === '@everyone') return true

    const name = val.user ? val.user.name : val.name
    await val.remove()
    ctx.say(embed.success(`Config has been cleared for ${name}!`))

    return true
  }

  async status (val, ctx, target) {
    const name = val.user ? val.user.name : val.name

    let db = await val.getFromDB()
    if (!db) {
      return ctx.say(
        embed.error({
          type: undefined,
          message: `Config not found for ${name}!`
        })
      )
    }

    const group = util.findName(db.groups, this.group)
    const command = util.findName(group.commands, this.name)

    const msg = command.enabled ? 'enabled' : 'disabled'
    ctx.say(embed.success(`Command: ${this.name} is ${msg} for ${name}!`))
  }

  async enable (val, ctx, target) {
    const name = val.user ? val.user.name : val.name
    await this.updateDB(target, val, true)
    ctx.say(embed.success(`Command: ${this.name} enabled for ${name}!`))

    return true
  }

  async disable (val, ctx, target) {
    const name = val.member ? val.member.user.tag : val.name
    await this.updateDB(target, val, false)
    ctx.say(embed.success(`Command: ${this.name} disabled for ${name}!`))
    return true
  }

  reload (ctx) {
    if (this.client.devs.indexOf(ctx.author.id) >= 0) return

    const reloaded = this.client.registry.reloadCommand(this)
    ctx.say(embed.success(reloaded))
    return true
  }

  unload (ctx) {
    if (this.client.devs.indexOf(ctx.author.id) >= 0) return

    const unloaded = this.client.registry.unloadCommand(this)
    ctx.say(embed.success(unloaded))
    return true
  }

  createSchema (guildRating) {
    return {
      name: this.name,
      enabled: this.rating <= guildRating
    }
  }
}

module.exports = Command
