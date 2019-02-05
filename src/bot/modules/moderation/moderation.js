import { removeFromArray } from '@util/array'

export async function addWarning (member, reason, ctx) {
  const warning = {
    reason,
    modID: ctx.author.id.toString(),
    timestamp: ctx.msg.createdAt.toUTCString()
  }

  await member.db.update(m => {
    m.warnings.push(warning)
    m.modlogs.push({
      action: 'Warned',
      reason,
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    })
  })
}

export async function newMod (role, ctx) {
  await role.db.update(r => (r.mod = true))
}

export async function removeMod (role, ctx) {
  await role.db.update(r => (r.mod = false))
}

export async function removeWarning (member, number, ctx) {
  if (!member.db.warnings.length) return false

  const warning = member.db.warnings[number - 1]
  if (!warning) return false

  await member.db.update(m => {
    removeFromArray(m.warnings, warning)
    m.modlogs.push({
      action: 'Warning deleted',
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    })
  })

  return true
}

export async function removeAllWarnings (member, ctx) {
  if (!member.db.warnings.length) return false

  await member.db.update(m => {
    m.warnings = []
    m.modlogs.push({
      action: 'Warnings cleared',
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    })
  })

  return true
}

export async function setNick (member, nickname, ctx) {
  await member.db.update(m => {
    m.nickname = nickname
    m.modlogs.push({
      action: 'Nickname set',
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    })
  })
}

export async function removeNick (member, ctx) {
  await member.db.update(m => {
    m.nickname = ''
    m.modlogs.push({
      action: 'Nickname removed',
      modID: ctx.author.id,
      timestamp: ctx.msg.createdAt.toUTCString()
    })
  })
}
