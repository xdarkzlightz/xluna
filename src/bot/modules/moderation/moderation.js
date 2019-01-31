import { removeFromArray } from '@util/array'

export async function addWarning (member, reason, ctx) {
  const warning = {
    reason,
    modID: ctx.author.id.toString(),
    timestamp: ctx.msg.createdAt.toUTCString()
  }

  member.db.data.warnings.push(warning)
}

export async function newMod (role, ctx) {
  role.db.data.mod = true
}

export async function removeMod (role, ctx) {
  if (!role) return false

  role.db.data.mod = false
}

export async function removeWarning (member, number, ctx) {
  if (!member || !member.db.data.warnings) return false
  member = member.db.data

  const warning = member.warnings[number - 1]
  if (!warning) return false

  removeFromArray(member.warnings, warning)

  return true
}

export async function removeAllWarnings (member, ctx) {
  if (!member || !member.db.data.warnings) return false
  member = member.db.data

  if (!member.warnings.length) return false

  member.warnings = []

  return true
}

export async function addLog (member, log, ctx) {
  if (!member) return false

  member.db.data.modLogs.push(log)
}

export async function setNick (member, nickname, ctx) {
  member.db.data.nickname = nickname
}

export async function removeNick (member, ctx) {
  if (!member) return false

  member.db.data.nickname = ''
}
