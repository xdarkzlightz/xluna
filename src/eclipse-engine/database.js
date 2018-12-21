const mongoose = require('mongoose')

const GuildModel = require('./models/guild')
const util = require('./util/util')

/**
 * Class that contains some core database methods
 */
class database {
  constructor (client) {
    this.client = client
  }

  /**
   * Connects to the mongodb database
   * @return {Promise} Code gets wrapped into a promise
   */
  async connect () {
    mongoose.set('debug', true)
    mongoose.connect(this.client.dbString)
    mongoose.connection
      .once('open', () => console.log('Database connected!'))
      .on('error', err => {
        console.log(err)
      })
  }

  /**
   * Creates a new guild entry in the mongodb database
   * @param  {discord.js guild}  guild  The discord.js guild we're entering into the database
   * @param  {Number}            rating The guild rating the guild should be
   * @return {Promise}                  Code gets wrapped into a promise
   */
  async createGuild (guild, rating) {
    const groups = util.createGroups(this.client.registry.groups, rating)
    console.log(groups)
    const config = {
      prefix: this.client.prefix,
      rating: rating
    }

    const role = { id: guild.id, groups }

    const dbGuild = new GuildModel({
      id: guild.id.toString(),
      config,
      channels: [],
      roles: [role],
      members: []
    })

    dbGuild.save()
  }
}
module.exports = database
