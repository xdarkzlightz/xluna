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
import { createJoinEmbed } from '@eclipse/util/embed'

import GameEngine from './game-engine/game-engine'
import uno from './modules/uno/uno.js'
import { RichEmbed } from 'discord.js'

const { version } = require('../package.json')

const client = new Client({
  token,
  prefix,
  devs,
  dbString,
  logLevel,
  botInvite,
  supportServer,
  version,
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

client.on('ready', () => {
  client.logger.info(
    `[xluna]: Bot ready on ${client.guilds.size} guilds, ${
      client.users.size
    } total members`
  )

  client.user.setActivity(
    `${client.prefix}help | In ${client.guilds.size} servers!`
  )
})

client.on('guildCreate', async guild => {
  client.logger.info(`Joined guild: ${guild.name} (${guild.id})`)

  const embed = new RichEmbed().setColor(0x5742f7)
  await createJoinEmbed(client, embed)
  guild.systemChannel.send(embed).catch()
})

client.on('guildDelete', guild => {
  client.logger.info(`Left guild: ${guild.name} (${guild.id})`)
})
