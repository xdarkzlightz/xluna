const Discord = require('discord.js')

const Registry = require('./registry')
const Dispatcher = require('./dispatcher')
const Database = require('./database')

const util = require('./util/util')

/**
 * An extension of the discord.js client
 * @extends Discord.Client
 */
class EclipseClient extends Discord.Client {
  constructor (options) {
    super(options)

    // Bot token
    this.token = options.token

    // Default prefix
    this.prefix = options.prefix

    // Groups path
    this.path = options.path

    // Array of ids that belong to the bot developer(s)
    this.devs = options.devs

    // mongodb database string
    this.dbString = options.dbString

    // Registry handles registering/loading/unloading/reloading commands and groups
    this.registry = new Registry(this)

    // Dispatcher controls if and how commands get executed
    this.dispatcher = new Dispatcher(this)

    // Database class handles connections
    this.database = new Database(this)

    // Utility class
    this.util = util

    // Whenever a message event occurs handle the message
    this.on('message', async msg => {
      await this.dispatcher.handleMessage(msg)
    })
  }

  // Custom login method, extends the discord.js login method
  login () {
    super.login(this.token)
  }

  // Will get the client or guild prefix (not implemented yet)
  getPrefix () {
    return this.prefix
  }
}

module.exports = EclipseClient
