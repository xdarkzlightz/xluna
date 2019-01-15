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
import { createJoinEmbed } from '@eclipse/util/embed'
import { findID } from '@eclipse/util/array'
import { Guild } from '@eclipse/database'

import GameEngine from './game-engine/game-engine'
import uno from './modules/uno/uno.js'
import { RichEmbed, Collection } from 'discord.js'

import { connect } from '@reddit/reddit'
import {
  handleChannelCreate,
  handleChannelDelete,
  handleChannelUpdate,
  handleRoleCreate,
  handleRoleDelete,
  handleRoleUpdate,
  handleMessageUpdate,
  handleMessageDelete,
  handleMemberUpdate
} from '@serverutil/serverutil'

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
  path: join(__dirname, '/command-groups/'),
  eventPath: join(__dirname, '/events/')
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

  client.r = await connect(r)

  // TEMP
  client.tags = new Collection()

  client.login()
})()

client.on('guildMemberAdd', async member => {
  const db = await Guild.findOne({ id: member.guild.id })
  if (db.config.welcome) {
    const channel = member.guild.channels.get(db.config.welcome.channelID)
    if (channel) channel.send(`<@${member.id}>, ${db.config.welcome.body}`)
  }

  if (db.config.roleID) {
    const role = member.guild.roles.get(db.config.roleID)
    if (role) await member.addRole(role)
  }

  const dbMember = findID(db.members, member.id)

  if (!dbMember) return

  if (dbMember.nickname) member.setNickname(dbMember.nickname)
})

client.on('guildMemberRemove', async member => {
  const db = await Guild.findOne({ id: member.guild.id })
  if (db.config.leave) {
    const channel = member.guild.channels.get(db.config.leave.channelID)
    if (channel) channel.send(`<@${member.id}>, ${db.config.leave.body}`)
  }
})

client.on('channelCreate', handleChannelCreate)

client.on('channelUpdate', handleChannelUpdate)

client.on('channelDelete', handleChannelDelete)

client.on('roleCreate', handleRoleCreate)

client.on('roleUpdate', handleRoleUpdate)

client.on('roleDelete', handleRoleDelete)

client.on('messageUpdate', handleMessageUpdate)

client.on('messageDelete', handleMessageDelete)

client.on('guildMemberUpdate', handleMemberUpdate)

client.on('guildCreate', async guild => {
  client.logger.info(`Joined guild: ${guild.name} (${guild.id})`)

  const embed = new RichEmbed().setColor(0x5742f7)
  await createJoinEmbed(client, embed)
  guild.systemChannel.send(embed).catch()
})

client.on('guildDelete', guild => {
  client.logger.info(`Left guild: ${guild.name} (${guild.id})`)
})
