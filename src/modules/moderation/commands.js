import {
  addWarning,
  removeWarning,
  removeAllWarnings,
  addLog
} from '@moderation/moderation'
import { embedWarnings, embedLogs } from '@moderation/embed'
import { RichEmbed } from 'discord.js'

export async function banMember (ctx, { member, reason }) {
  member.ban({ reason: reason })
  ctx.say(`*${member.user.tag} has been banned!*`)

  await addLog(member, ctx.db, {
    action: 'Banned',
    reason,
    modID: ctx.author.id,
    timestamp: ctx.msg.createdAt.toUTCString()
  })

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been banned from ${ctx.guild.name} for: ${reason}*`
  ).catch()
}

export async function softbanMember (ctx, { member, days, reason }) {
  member.ban({ reason: reason, days })
  ctx.guild.unban(member, reason)

  await addLog(member, ctx.db, {
    action: 'Soft-banned',
    reason,
    modID: ctx.author.id,
    timestamp: ctx.msg.createdAt.toUTCString()
  })

  ctx.say(`*${member.user.tag} has been soft-banned!*`)

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been soft-banned from ${ctx.guild.name} for: ${reason}*`
  ).catch()
}

export async function kickMember (ctx, { member, reason }) {
  member.kick(reason)
  ctx.say(`*${member.user.tag} has been kicked!*`)

  await addLog(member, ctx.db, {
    action: 'Kicked',
    reason,
    modID: ctx.author.id,
    timestamp: ctx.msg.createdAt.toUTCString()
  })

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been kicked from ${ctx.guild.name} for: ${reason}*`
  ).catch()
}

export async function warnMember (ctx, { member, reason }) {
  await addWarning(member, reason, ctx)

  await addLog(member, ctx.db, {
    action: 'Warned',
    reason,
    modID: ctx.author.id,
    timestamp: ctx.msg.createdAt.toUTCString()
  })

  ctx.say(`*${member.user.tag} has been warned!*`)

  const dm = await member.user.createDM().catch()
  dm.send(`*You have been warned in ${ctx.guild.name} for: ${reason}*`).catch()
}

export async function getWarnings (ctx, member) {
  const embed = new RichEmbed()
  await embedWarnings(embed, member, ctx)
  ctx.say(embed)
}

export async function deleteWarning (ctx, { member, number }) {
  const removed = await removeWarning(member, number, ctx.db)
  if (!removed) return ctx.say("*Warning doesn't exist*")

  await addLog(member, ctx.db, {
    action: 'Warning deleted',
    modID: ctx.author.id,
    timestamp: ctx.msg.createdAt.toUTCString()
  })

  ctx.say('*Warning removed!*')
}

export async function clearWarnings (ctx, member) {
  const removed = await removeAllWarnings(member, ctx.db)
  if (!removed) return ctx.say('*Member has no warnings*')

  await addLog(member, ctx.db, {
    action: 'Warnings cleared',
    modID: ctx.author.id,
    timestamp: ctx.msg.createdAt.toUTCString()
  })

  ctx.say('*Warnings removed*')
}

export async function sendLogs (ctx, { member }) {
  const embed = new RichEmbed()

  await embedLogs(embed, member, ctx)

  ctx.say(embed)
}
