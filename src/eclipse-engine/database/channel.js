import { findID } from '@eclipse/util/array'
import { findCommand } from '@eclipse/util/database'

export function getChannel (id, db) {
  let channel = findID(db.channels, id)
  if (!channel) {
    db.channels.push({ id })
    channel = findID(db.channels, id)
  }

  return channel
}

export function addGroupsToChannel (channel, db) {
  const defaultRole = findID(db.roles, db.id)

  channel.groups = defaultRole.groups
}

export function updateCommandInChannel (id, cmd, enabled, db) {
  const channel = getChannel(id, db)

  if (!channel.groups.length) addGroupsToChannel(channel, db)
  const command = findCommand(channel.groups, cmd)

  command.enabled = enabled
}

export function commandEnabledInChannel (id, cmd, db) {
  const channel = findID(db.channels, id)
  if (!channel) return

  const command = findCommand(channel.groups, cmd)

  return command.enabled
}
