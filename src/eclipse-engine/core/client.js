import { Client } from 'discord.js'
import mongoose from 'mongoose'

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
      level: 'debug',
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

    /** Array of discord.js user ids that belong to the bot developer(s) */
    this.devs = options.devs

    /** mongoDB connection string */
    this.dbString = options.dbString

    /** Eclipse Registry */
    this.registry = new Registry(this)

    /** Eclipse Dispatcher */
    this.dispatcher = new Dispatcher(this)

    // Whenever a message event occurs handle the message
    this.on('message', async msg => {
      this.logger.debug(
        `Handling message: ${msg.id} in channel: ${msg.channel.id}, guild: ${
          msg.guild.id
        }`
      )
      await this.dispatcher.handleMessage(msg)
    })

    this.logger.debug('[Eclipse-Engine]: Created client')
  }

  /** Custom login, calls super.login() with the token provided */
  login () {
    super.login(this.token)
  }

  /** Connects to the provided mongoDB database using the connection string provided to the client */
  async connect () {
    mongoose.set('debug', (collectionName, methodName, arg1, arg2) => {
      this.logger.debug(
        `[Mongoose]: ${collectionName}.${methodName}(${JSON.stringify(
          arg1
        )}, ${JSON.stringify(arg2)}`
      )
    })

    mongoose.connect(
      this.dbString,
      { useNewUrlParser: true }
    )
    mongoose.connection
      .once('open', () => this.logger.info('[Mongoose]: Database connected!'))
      .on('error', err => {
        this.logger.error(
          `Something went wrong. ${err}\n Call stack: ${err.stack}`
        )
      })
  }
}

export default EclipseClient
