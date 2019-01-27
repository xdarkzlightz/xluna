import { Client } from 'discord.js'

import { createLogger, format, transports } from 'winston'

import { Registry, Dispatcher } from '@eclipse/core'

/**
 * An extension of the discord.js client
 * @extends Discord.Client
 */
class EclipseClient extends Client {
  /**
   * @typedef {Object} EclipseClientOptions
   * @property {string} token - Bot token
   * @property {string} prefix - Default bot prefix
   * @property {string} path - Path to the command groups
   * @property {[string]} devs - Array of discord.js ids
   * @property {string} dbString - MongoDB connection string
   */

  /**
   * Create a new client
   * @param {EclipseClientOptions} options - Client options
   */
  constructor (options) {
    super(options)

    this.logger = createLogger({
      level: options.logLevel,
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
      transports: [new transports.Console()]
    })

    /** Bot token */
    this.token = options.token

    /** Default bot prefix */
    this.prefix = options.prefix

    /** Path to the command groups */
    this.path = options.path
    this.eventPath = options.eventPath

    /** Array of discord.js user ids that belong to the bot developer(s) */
    this.devs = options.devs

    /** mongoDB connection string */
    this.dbString = options.dbString
    this.supportServer = options.supportServer
    this.botInvite = options.botInvite
    this.version = options.version

    /** Eclipse Registry */
    this.registry = new Registry(this)

    /** Eclipse Dispatcher */
    this.dispatcher = new Dispatcher(this)

    // Whenever a message event occurs handle the message
    this.on('message', async msg => {
      this.logger.debug(
        `Handling message: ${msg.id} in channel: ${msg.channel.id}`
      )

      if (msg.guild && msg.guild.available) {
        await this.dispatcher.handleMessage(msg)
      }
    })

    this.logger.debug('[Eclipse-Engine]: Created client')
  }

  /** Custom login, calls super.login() with the token provided */
  login () {
    super.login(this.token)
  }

  async setProvider (provider) {
    await provider.init()

    this.db = provider
  }
}

export default EclipseClient
