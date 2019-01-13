import {
  addWarning,
  removeWarning,
  removeAllWarnings
} from '@moderation/moderation'
import { embedWarnings } from '@moderation/embed'
import { RichEmbed } from 'discord.js'

export async function banMember (ctx, { member, reason }) {
  member.ban({ reason: reason })
  ctx.say(`*${member.user.tag} has been banned!*`)

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been banned from ${ctx.guild.name} for: ${reason}*`
  ).catch()
}

export async function softbanMember (ctx, { member, days, reason }) {
  member.ban({ reason: reason, days })
  ctx.guild.unban(member, reason)

  ctx.say(`*${member.user.tag} has been soft-banned!*`)

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been soft-banned from ${ctx.guild.name} for: ${reason}*`
  ).catch()
}

export async function kickMember (ctx, { member, reason }) {
  member.kick(reason)
  ctx.say(`*${member.user.tag} has been kicked!*`)

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been kicked from ${ctx.guild.name} for: ${reason}*`
  ).catch()
}

export async function warnMember (ctx, { member, reason }) {
  await addWarning(member, reason, ctx)

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

  ctx.say('*Warning removed!*')
}

export async function clearWarnings (ctx, member) {
  const removed = await removeAllWarnings(member, ctx.db)
  if (!removed) return ctx.say('*Member has no warnings*')

  ctx.say('*Warnings removed*')
}
