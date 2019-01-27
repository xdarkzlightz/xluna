import { removeFromArray } from '@util/array'

export async function addWarning (member, reason, ctx) {
  let dbMember = ctx.guild.db.members.get(member.id)
  const warning = {
    reason,
    modID: ctx.author.id.toString(),
    timestamp: ctx.msg.createdAt.toUTCString()
  }

  if (!dbMember) {
    ctx.guild.db.data.members.push({
      id: member.id,
      warnings: [warning]
    })
    await ctx.db.save(ctx.guild.db.data, ctx)
    return
  }

  if (!dbMember.data.warnings) dbMember.data.warnings = []

  dbMember.data.warnings.push(warning)

  await ctx.db.save(ctx.guild.db.data, ctx)
}

export async function newMod (role, ctx) {
  let dbRole = ctx.guild.db.roles.get(role.id)

  if (!dbRole) {
    ctx.guild.db.data.roles.push({
      id: role.id,
      mod: true
    })
    await ctx.db.save(ctx.guild.db.data, ctx)
    return
  }

  dbRole.data.mod = true

  await ctx.db.save(ctx.guild.db.data, ctx)
}

export async function removeMod (role, ctx) {
  let dbRole = ctx.guild.db.roles.get(role.id)

  if (!dbRole) return false

  dbRole.data.mod = false

  await ctx.db.save(ctx.guild.db.data, ctx)
}

export async function removeWarning (member, number, ctx) {
  let dbMember = ctx.guild.db.members.get(member.id)
  if (!dbMember || !dbMember.data.warnings) return false
  dbMember = dbMember.data

  const warning = dbMember.warnings[number - 1]
  if (!warning) return false

  removeFromArray(dbMember.warnings, warning)
  await ctx.db.save(ctx.guild.db.data, ctx)

  return true
}

export async function removeAllWarnings (member, ctx) {
  let dbMember = ctx.guild.db.members.get(member.id)
  if (!dbMember || !dbMember.data.warnings) return false
  dbMember = dbMember.data

  if (!dbMember.warnings.length) return false

  dbMember.warnings = []

  await ctx.db.save(ctx.guild.db.data, ctx)

  return true
}

export async function addLog (member, log, ctx) {
  let dbMember = ctx.guild.db.members.get(member.id)
  if (!dbMember) return false

  if (!dbMember.data.modLogs) dbMember.data.modLogs = []
  dbMember.data.modLogs.push(log)

  await ctx.db.save(ctx.guild.db.data)
}

export async function setNick (member, nickname, ctx) {
  let dbMember = ctx.guild.db.members.get(member.id)
  if (!dbMember) {
    ctx.guild.db.data.members.push({ id: member.id, nickname })
    await ctx.db.save(ctx.guild.db.data, ctx)
    return
  }

  dbMember.data.nickname = nickname

  await ctx.db.save(ctx.guild.db.data, ctx)
}

export async function removeNick (member, ctx) {
  let dbMember = ctx.guild.db.members.get(member.id)
  if (!dbMember) return false

  dbMember.data.nickname = ''

  await ctx.db.save(ctx.guild.db.data, ctx)
}
