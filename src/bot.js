import { join } from 'path'
import {
  token,
  devs,
  dbString,
  prefix,
  logLevel,
  botInvite,
  supportServer
} from '../config'

import { Client } from '@eclipse/core'

import GameEngine from './game-engine/game-engine'
import uno from './modules/uno/uno.js'

const client = new Client({
  token,
  prefix,
  devs,
  dbString,
  logLevel,
  botInvite,
  supportServer,
  path: join(__dirname, '/command-groups/')
})

// Use an asynchronus IIFE to initialize the bot
;(async () => {
  await client.connect()
  await client.registry.init()

  client.gameEngine = new GameEngine()

  client.gameEngine.on('GameEngine-debug', msg => {
    client.logger.debug('[GameEngine]: ' + msg)
  })
  client.gameEngine.registerGame('uno', uno)

  client.login()
})()

client.on('ready', () => client.logger.info('[Eclipse-Engine]: Bot ready!'))
