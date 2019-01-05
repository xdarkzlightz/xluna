import { findID } from '@eclipse/util/array'
import { findCommand } from '@eclipse/util/database'

export function getMember (id, db) {
  let member = findID(db.members, id)
  if (!member) {
    db.members.push({ id })
    member = findID(db.members, id)
  }
  return member
}

export function addGroupsToMember (member, db) {
  const defaultRole = findID(db.roles, db.id)

  member.groups = defaultRole.groups
}

export function updateCommandInMember (id, cmd, enabled, db) {
  const member = getMember(id, db)

  if (!member.groups.length) addGroupsToMember(member, db)
  const command = findCommand(member.groups, cmd)

  command.enabled = enabled
}

export function commandEnabledInMember (id, cmd, db) {
  const member = findID(db.members, id)
  if (!member) return

  const command = findCommand(member.groups, cmd)

  return command.enabled
}
