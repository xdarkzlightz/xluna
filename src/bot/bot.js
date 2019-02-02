import { Collection } from 'discord.js'

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
} from '@config'

import { Client } from '@engines/eclipse/core'

import GameEngine from '@engines/game/game-engine'
import uno from '@modules/uno/uno.js'

import { connect } from '@modules/reddit/reddit'

const { version } = require('../../package.json')

const client = new Client({
  token,
  prefix,
  devs,
  logLevel,
  botInvite,
  supportServer,
  version,
  dbString,
  path: join(__dirname, '/command-groups/'),
  eventPath: join(__dirname, '/events/')
})

// Use an asynchronus IIFE to initialize the bot
;(async () => {
  try {
    await client.init()

    client.gameEngine = new GameEngine()

    client.gameEngine.on('GameEngine-debug', msg => {
      client.logger.debug('[GameEngine]: ' + msg)
    })
    client.gameEngine.registerGame('uno', uno)

    client.r = await connect(r)
    client.levelCooldowns = new Collection()

    client.login()
  } catch (e) {
    client.logger.error(`${e}:\nstack: ${e.stack}`)
  }
})()
