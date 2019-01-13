import { removeFromArray } from '@eclipse/util/array'

export function getTag (name, db) {
  const tag = db.config.tags.find(tag => tag.name === name)
  if (!tag) return false
  return tag
}

export async function saveTag (tag, db) {
  db.config.tags.push(tag)
  db.save()
}

export async function removeTag (tag, db) {
  removeFromArray(db.config.tags, tag)
  db.save()
}
