import { findName } from '@eclipse/util/array'

// Function for creating an array of group objects
export function createGroups (collection, rating) {
  let groups = []
  collection.array().forEach(group => {
    if (group.devOnly) return
    groups.push(group.createSchema(rating))
  })

  return groups
}

export function findCommand (groups, cmd) {
  const group = findName(groups, cmd.group)
  const command = findName(group.commands, cmd.name)
  return command
}

export const ratings = {
  PG: 0,
  PG13: 1,
  NSFW: 2
}
