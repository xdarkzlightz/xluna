import {
  addWarning,
  removeWarning,
  removeAllWarnings,
  addLog,
  setNick,
  removeNick
} from '@moderation/moderation'
import { embedWarnings, embedLogs } from '@moderation/embed'
import { RichEmbed } from 'discord.js'

export async function banMember (ctx, { member, reason }) {
  member.ban({ reason: reason })
  ctx.say(`*${member.user.tag} has been banned!*`)

  await addLog(
    member,
    {
      action: 'Banned',
      reason,
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    },
    ctx
  )

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been banned from ${ctx.guild.name} for: ${reason}*`
  ).catch()
}

export async function softbanMember (ctx, { member, days, reason }) {
  member.ban({ reason: reason, days })
  ctx.guild.unban(member, reason)

  await addLog(
    member,
    {
      action: 'Soft-banned',
      reason,
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    },
    ctx
  )

  ctx.say(`*${member.user.tag} has been soft-banned!*`)

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been soft-banned from ${ctx.guild.name} for: ${reason}*`
  ).catch()
}

export async function kickMember (ctx, { member, reason }) {
  member.kick(reason)
  ctx.say(`*${member.user.tag} has been kicked!*`)

  await addLog(
    member,
    {
      action: 'Kicked',
      reason,
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    },
    ctx
  )

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been kicked from ${ctx.guild.name} for: ${reason}*`
  ).catch()
}

export async function warnMember (ctx, { member, reason }) {
  await addWarning(member, reason, ctx)

  await addLog(
    member,
    {
      action: 'Warned',
      reason,
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    },
    ctx
  )

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
  const removed = await removeWarning(member, number, ctx)
  if (!removed) return ctx.say("*Warning doesn't exist*")

  await addLog(
    member,
    {
      action: 'Warning deleted',
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    },
    ctx
  )

  ctx.say('*Warning removed!*')
}

export async function clearWarnings (ctx, member) {
  const removed = await removeAllWarnings(member, ctx)
  if (!removed) return ctx.say('*Member has no warnings*')

  await addLog(
    member,
    {
      action: 'Warnings cleared',
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    },
    ctx
  )

  ctx.say('*Warnings removed*')
}

export async function sendLogs (ctx, { member }) {
  const embed = new RichEmbed()

  await embedLogs(embed, member, ctx)

  ctx.say(embed)
}

export async function addNick (ctx, { member, nickname }) {
  member.setNickname(nickname)

  await setNick(member, nickname, ctx)

  await addLog(
    member,
    {
      action: 'Nickname set',
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    },
    ctx
  )

  ctx.say(`*Nickname changed to ${nickname} for ${member.user.tag}*`)
}

export async function deleteNick (ctx, member) {
  member.setNickname('')

  await removeNick(member, ctx)

  await addLog(
    member,
    {
      action: 'Nickname removed',
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    },
    ctx
  )

  ctx.say(`*Nickname removed nickname for ${member.user.tag}*`)
}
