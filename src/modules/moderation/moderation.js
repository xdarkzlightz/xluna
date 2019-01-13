import { getMember } from '@eclipse/database'
import { removeFromArray } from '@eclipse/util/array'

export async function addWarning (member, reason, ctx) {
  const dbMember = getMember(member.id, ctx.db)

  dbMember.warnings.push({
    reason,
    modID: ctx.author.id.toString(),
    timestamp: ctx.msg.createdAt.toUTCString()
  })

  await ctx.db.save()
}

export async function removeWarning (member, number, db) {
  const dbMember = getMember(member.id, db)

  const warning = dbMember.warnings[number - 1]
  if (!warning) return false

  removeFromArray(dbMember.warnings, warning)
  await db.save()

  return true
}

export async function removeAllWarnings (member, db) {
  const dbMember = getMember(member.id, db)

  if (!dbMember.warnings.length) return false

  dbMember.warnings = []

  await db.save()

  return true
}

export async function addLog (member, db, log) {
  const dbMember = getMember(member.id, db)

  dbMember.modLogs.push(log)

  await db.save()
}

export async function setNick (member, nickname, db) {
  const dbMember = getMember(member.id, db)

  dbMember.nickname = nickname

  await db.save()
}

export async function removeNick (member, db) {
  const dbMember = getMember(member.id, db)

  dbMember.nickname = ''

  await db.save()
}
