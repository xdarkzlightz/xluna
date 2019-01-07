import { findID } from '@eclipse/util/array'
import { findCommand } from '@eclipse/util/database'

export function getRole (id, db) {
  let role = findID(db.roles, id)
  if (!role) {
    db.roles.push({ id })
    role = findID(db.roles, id)
  }
  return role
}

export function addGroupsToRole (role, db) {
  const defaultRole = findID(db.roles, db.id)

  role.groups = defaultRole.groups
}

export function updateCommandInRole (id, cmd, enabled, db) {
  const role = getRole(id, db)

  if (!role.groups.length) addGroupsToRole(role, db)
  const command = findCommand(role.groups, cmd)

  command.enabled = enabled
}

export function commandEnabledInRole (id, cmd, db) {
  const role = findID(db.roles, id)
  if (!role) return

  const command = findCommand(role.groups, cmd)

  return command.enabled
}
