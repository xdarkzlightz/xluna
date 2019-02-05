import { RichEmbed } from 'discord.js'
import {
  addWarning,
  removeWarning,
  removeAllWarnings,
  setNick,
  removeNick,
  newMod,
  removeMod
} from './moderation'
import { embedWarnings, embedLogs } from './embed'

const isMod = (roles, member) => {
  if (member.hasPermission('ADMINISTRATOR')) return true
  let isMod
  roles.forEach(roleDB => {
    if (isMod) return
    const memberRole = member.roles.get(roleDB.data.id)
    if (!memberRole) return

    const foundRole = roles.get(memberRole.id)
    const mod = foundRole.mod
    if (mod) isMod = mod
  })
  return isMod
}

export async function banMember (ctx, { member, reason }) {
  const mod = isMod(ctx.guild.db.roles, ctx.member)
  if (!mod) return

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been banned from ${ctx.guild.name} for: ${reason}*`
  ).catch()

  member.ban({ reason })
  ctx.say(`*${member.user.tag} has been banned!*`)

  await member.db.update(m =>
    m.modlogs.push({
      action: 'Banned',
      reason,
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    })
  )
}

export async function softbanMember (ctx, { member, days, reason }) {
  const mod = isMod(ctx.guild.db.roles, ctx.member)
  if (!mod) return

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been soft-banned from ${ctx.guild.name} for: ${reason}*`
  ).catch()

  member.ban({ reason, days })
  ctx.guild.unban(member, reason)

  member.db.update(m =>
    m.modlogs.push({
      action: 'Soft-banned',
      reason,
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    })
  )

  ctx.say(`*${member.user.tag} has been soft-banned!*`)
}

export async function kickMember (ctx, { member, reason }) {
  const mod = isMod(ctx.guild.db.roles, ctx.member)
  if (!mod) return

  const dm = await member.user.createDM().catch()
  dm.send(
    `*You have been kicked from ${ctx.guild.name} for: ${reason}*`
  ).catch()

  member.kick(reason)
  ctx.say(`*${member.user.tag} has been kicked!*`)

  await member.db.update(m =>
    m.modlogs.push({
      action: 'Kicked',
      reason,
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    })
  )
}

export async function warnMember (ctx, { member, reason }) {
  const mod = isMod(ctx.guild.db.roles, ctx.member)
  if (!mod) return

  await addWarning(member, reason, ctx)

  ctx.say(`*${member.user.tag} has been warned!*`)

  const dm = await member.user.createDM().catch()
  dm.send(`*You have been warned in ${ctx.guild.name} for: ${reason}*`).catch()
}

export async function getWarnings (ctx, { member }) {
  const embed = new RichEmbed()
  await embedWarnings(embed, member, ctx)
  ctx.say(embed)
}

export async function deleteWarning (ctx, { member, number }) {
  const mod = isMod(ctx.guild.db.roles, ctx.member)
  if (!mod) return

  const removed = await removeWarning(member, number, ctx)
  if (!removed) return ctx.say("*Warning doesn't exist*")

  ctx.say('*Warning removed!*')
}

export async function clearWarnings (ctx, { member }) {
  const mod = isMod(ctx.guild.db.roles, ctx.member)
  if (!mod) return

  const removed = await removeAllWarnings(member, ctx)
  if (!removed) return ctx.say('*Member has no warnings*')

  ctx.say('*Warnings removed*')
}

export async function sendLogs (ctx, { member }) {
  const mod = isMod(ctx.guild.db.roles, ctx.member)
  if (!mod) return

  const embed = new RichEmbed()

  await embedLogs(embed, member, ctx)

  ctx.say(embed)
}

export async function addNick (ctx, { member, nickname }) {
  const mod = isMod(ctx.guild.db.roles, ctx.member)
  if (!mod) return

  member.setNickname(nickname)

  await setNick(member, nickname, ctx)

  ctx.say(`*Nickname changed to ${nickname} for ${member.user.tag}*`)
}

export async function deleteNick (ctx, member) {
  const mod = isMod(ctx.guild.db.roles, ctx.member)
  if (!mod) return

  member.setNickname('')

  await removeNick(member, ctx)

  ctx.say(`*Nickname removed nickname for ${member.user.tag}*`)
}

export async function addMod (ctx, { role }) {
  await newMod(role, ctx)
  ctx.success(`Added mod role ${role.name}`)
}

export async function deleteMod (ctx, { role }) {
  await removeMod(role, ctx)
  ctx.success(`removed mod role ${role.name}`)
}
