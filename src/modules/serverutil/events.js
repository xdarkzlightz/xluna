import { RichEmbed } from 'discord.js'
import {
  embedChannel,
  embedRole,
  embedMessage,
  embedMember
} from '@serverutil/embed'

const logMember = (action, { oldMember, member }, embed, db) => {
  const logChannel = member.guild.channels.get(db.config.logger.channelID)
  embedMember(action, { oldMember, member }, embed)
  if (logChannel) logChannel.send(embed)
}

const logChannel = (action, { oldChannel, channel }, embed, db) => {
  const logChannel = channel.guild.channels.get(db.config.logger.channelID)
  embedChannel(action, { oldChannel, channel }, embed)
  if (logChannel) logChannel.send(embed)
}

const logRole = (action, { oldRole, role }, embed, db) => {
  const logChannel = role.guild.channels.get(db.config.logger.channelID)
  embedRole(action, { oldRole, role }, embed)
  if (logChannel) logChannel.send(embed)
}

export async function handleChannelCreate (channel, db) {
  if (channel.type !== 'group' || channel.type !== 'dm') {
    const embed = new RichEmbed()
    if (!db.config.logger) return

    if (db.config.logger.channelCreate) {
      logChannel('created', { channel }, embed, db)
    }
  }
}

export async function handleChannelDelete (channel, db) {
  if (channel.type !== 'group' || channel.type !== 'dm') {
    const embed = new RichEmbed()
    if (!db.config.logger) return

    if (db.config.logger.channelCreate) {
      logChannel('deleted', { channel }, embed, db)
    }
  }
}

export async function handleChannelUpdate (oldChannel, channel, db) {
  if (channel.type !== 'group' || channel.type !== 'dm') {
    const embed = new RichEmbed()
    if (!db.config.logger) return
    if (db.config.logger.channelCreate) {
      logChannel('updated', { oldChannel, channel }, embed, db)
    }
  }
}

export async function handleRoleCreate (role, db) {
  const embed = new RichEmbed()
  if (!db.config.logger) return

  if (db.config.logger.channelCreate) {
    logRole('created', { role }, embed, db)
  }
}

export async function handleRoleUpdate (oldRole, role, db) {
  if (oldRole.calculatedPosition !== role.calculatedPosition) return
  if (oldRole.id === role.guild.id) return
  if (oldRole.name === role.name && oldRole.hexColor === role.hexColor) return

  const embed = new RichEmbed()

  if (!db.config.logger) return

  if (db.config.logger.channelCreate) {
    logRole('updated', { oldRole, role }, embed, db)
  }
}

export async function handleRoleDelete (role, db) {
  const embed = new RichEmbed()

  if (!db.config.logger) return

  if (db.config.logger.channelCreate) {
    logRole('deleted', { role }, embed, db)
  }
}

export async function handleMessageUpdate (oldMsg, message, db) {
  if (message.author.bot) return
  const embed = new RichEmbed()

  if (!db.config.logger) return

  if (db.config.logger.channelCreate) {
    const logChannel = message.guild.channels.get(db.config.logger.channelID)
    embedMessage('edited', { oldMsg, message }, embed)
    if (logChannel) logChannel.send(embed)
  }
}

export async function handleMessageDelete (message, db) {
  const embed = new RichEmbed()
  if (!db.config.logger) return

  if (db.config.logger.channelCreate) {
    const logChannel = message.guild.channels.get(db.config.logger.channelID)
    embedMessage('deleted', { message }, embed)
    if (logChannel) logChannel.send(embed)
  }
}

export async function handleMemberUpdate (oldMember, member, db) {
  if (member.user.bot) return
  const embed = new RichEmbed()
  if (!db.config.logger) return

  if (db.config.logger.channelCreate) {
    logMember('updated', { oldMember, member }, embed, db)
  }
}
