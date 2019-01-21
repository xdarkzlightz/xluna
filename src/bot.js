import { join } from 'path'
import {
  token,
  devs,
  dbString,
  prefix,
  logLevel,
  botInvite,
  supportServer,
  r
} from '../config'

import { Client } from '@eclipse/core'
import MongoProvider from '@eclipse/providers/mongo'

import GameEngine from './game-engine/game-engine'
import uno from './modules/uno/uno.js'

import { connect } from '@reddit/reddit'

const { version } = require('../package.json')

const client = new Client({
  token,
  prefix,
  devs,
  logLevel,
  botInvite,
  supportServer,
  version,
  path: join(__dirname, '/command-groups/'),
  eventPath: join(__dirname, '/events/')
})

// Use an asynchronus IIFE to initialize the bot
;(async () => {
  try {
    await client.setProvider(new MongoProvider(dbString, client))

    await client.registry.init()

    client.gameEngine = new GameEngine()

    client.gameEngine.on('GameEngine-debug', msg => {
      client.logger.debug('[GameEngine]: ' + msg)
    })
    client.gameEngine.registerGame('uno', uno)

    client.r = await connect(r)

    client.login()
  } catch (e) {
    client.logger.error(`${e}:\nstack: ${e.stack}`)
  }
})()
