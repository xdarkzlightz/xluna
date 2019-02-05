import { Client } from 'discord.js'

import { createLogger, format, transports } from 'winston'

import { Registry, Dispatcher } from '@engines/eclipse/core'
import Provider from '@provider'
import { ReactionMenuManager } from '@engines/eclipse/reactionMenus/reactionMenuManager'
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

    this.token = options.token
    this.dbString = options.dbString
    this.prefix = options.prefix
    this.path = options.path
    this.eventPath = options.eventPath
    this.devs = options.devs
    this.supportServer = options.supportServer
    this.botInvite = options.botInvite
    this.version = options.version

    this.registry = new Registry(this)
    this.dispatcher = new Dispatcher(this)
    this.db = new Provider(options.dbString, this)
    this.reactionMenuManager = new ReactionMenuManager()

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

  async init () {
    await this.db.init()
    await this.registry.init()
  }

  /** Custom login, calls super.login() with the token provided */
  login () {
    super.login(this.token)
  }
}

export default EclipseClient
