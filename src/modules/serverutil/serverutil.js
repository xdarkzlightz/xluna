import { RichEmbed } from 'discord.js'
import {
  embedChannel,
  embedRole,
  embedMessage,
  embedMember
} from '@serverutil/embed'
import { Guild } from '@eclipse/database'

export async function setChannel (channel, db) {
  if (!db.config.logger) db.config.logger = {}
  db.config.logger.channelID = channel.id
  await db.save()
}

export async function updateLoggerConfig (target, db) {
  if (!db.config.logger.channelID) return false

  let [type, action] = target.split('-')

  if (action) action = action.replace(/^\w/, c => c.toUpperCase())

  let enabling = true
  if (db.config.logger[`${type}${action || ''}`]) enabling = false

  db.config.logger[`${type}${action || ''}`] = enabling

  await db.save()
  return true
}

export async function handleChannelCreate (channel) {
  if (channel.type !== 'group' || channel.type !== 'dm') {
    const embed = new RichEmbed()

    const db = await Guild.findOne({ id: channel.guild.id })
    if (db.config.logger.channelCreate) {
      const logChannel = channel.guild.channels.get(db.config.logger.channelID)
      embedChannel('created', { channel }, embed)
      if (logChannel) logChannel.send(embed)
    }
  }
}

export async function handleChannelDelete (channel) {
  if (channel.type !== 'group' || channel.type !== 'dm') {
    const embed = new RichEmbed()

    const db = await Guild.findOne({ id: channel.guild.id })
    if (db.config.logger.channelCreate) {
      const logChannel = channel.guild.channels.get(db.config.logger.channelID)
      embedChannel('deleted', { channel }, embed)
      if (logChannel) logChannel.send(embed)
    }
  }
}

export async function handleChannelUpdate (oldChannel, channel) {
  if (channel.type !== 'group' || channel.type !== 'dm') {
    const embed = new RichEmbed()

    const db = await Guild.findOne({ id: channel.guild.id })
    if (db.config.logger.channelCreate) {
      const logChannel = channel.guild.channels.get(db.config.logger.channelID)
      embedChannel('updated', { oldChannel, channel }, embed)
      if (logChannel) logChannel.send(embed)
    }
  }
}

export async function handleRoleCreate (role) {
  const embed = new RichEmbed()

  const db = await Guild.findOne({ id: role.guild.id })
  if (db.config.logger.channelCreate) {
    const logChannel = role.guild.channels.get(db.config.logger.channelID)
    embedRole('created', { role }, embed)
    if (logChannel) logChannel.send(embed)
  }
}

export async function handleRoleUpdate (oldRole, role) {
  if (oldRole.calculatedPosition !== role.calculatedPosition) return
  if (oldRole.id === role.guild.id) return
  if (oldRole.name === role.name && oldRole.hexColor === role.hexColor) return

  const embed = new RichEmbed()

  const db = await Guild.findOne({ id: role.guild.id })
  if (db.config.logger.channelCreate) {
    const logChannel = role.guild.channels.get(db.config.logger.channelID)
    embedRole('updated', { oldRole, role }, embed)
    if (logChannel) logChannel.send(embed)
  }
}

export async function handleRoleDelete (role) {
  const embed = new RichEmbed()

  const db = await Guild.findOne({ id: role.guild.id })
  if (db.config.logger.channelCreate) {
    const logChannel = role.guild.channels.get(db.config.logger.channelID)
    embedRole('deleted', { role }, embed)
    if (logChannel) logChannel.send(embed)
  }
}

export async function handleMessageUpdate (oldMsg, message) {
  if (message.author.bot) return
  const embed = new RichEmbed()

  const db = await Guild.findOne({ id: message.guild.id })
  if (db.config.logger.channelCreate) {
    const logChannel = message.guild.channels.get(db.config.logger.channelID)
    embedMessage('edited', { oldMsg, message }, embed)
    if (logChannel) logChannel.send(embed)
  }
}

export async function handleMessageDelete (message) {
  const embed = new RichEmbed()

  const db = await Guild.findOne({ id: message.guild.id })
  if (db.config.logger.channelCreate) {
    const logChannel = message.guild.channels.get(db.config.logger.channelID)
    embedMember('deleted', { message }, embed)
    if (logChannel) logChannel.send(embed)
  }
}

export async function handleMemberUpdate (oldMember, member) {
  if (member.user.bot) return
  const embed = new RichEmbed()

  const db = await Guild.findOne({ id: member.guild.id })
  if (db.config.logger.channelCreate) {
    const logChannel = member.guild.channels.get(db.config.logger.channelID)
    embedMember('updated', { oldMember, member }, embed)
    if (logChannel) logChannel.send(embed)
  }
}
