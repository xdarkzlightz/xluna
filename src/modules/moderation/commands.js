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
