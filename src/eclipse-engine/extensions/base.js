const Guild = require('../models/guild')

class EclipseBase {
  constructor (type, client, obj) {
    // Objects name
    this.name = obj.name ? obj.name : obj.user.username

    // Objects id
    this.id = obj.id

    // Type of object, used for database
    this.type = type

    // Eclipse client
    this.client = client

    // Utility class
    this.util = client.util

    // The original discord guild object
    this.guild = obj.guild
  }

  // Database methods
  // Gets the guilds entry from the database
  async getDB () {
    return Guild.findOne({ id: this.guild.id }).catch(err => console.log(err))
  }

  // Gets the correlating object from the database
  async getFromDB () {
    const db = await this.getDB()
    return this.util.findID(db[`${this.type}s`], this.id)
  }

  // Saves a specified update to the database
  async save (update, findQuery) {
    if (findQuery) {
      await Guild.updateOne(findQuery, update)
    } else {
      await Guild.updateOne({ id: this.guild.id }, update)
    }
  }

  // Creates a new entry in the database
  async newEntry () {
    const db = await this.getDB()

    const role = this.util.findID(db.roles, db.id)
    db[`${this.type}s`].push({ id: this.id.toString(), groups: role.groups })

    await db.save()
  }

  // Removes the entry from the database
  async remove () {
    await this.save({
      $pull: { [`${this.type}s`]: { id: this.id.toString() } }
    })
  }
}

module.exports = EclipseBase
