import { removeFromArray } from '@util/array'

export function getTag (name, ctx) {
  const db = ctx.guild.db
  if (!db.config.tags) return false

  const tag = db.config.tags.find(tag => tag.name === name)
  if (!tag) return false
  return tag
}

export async function saveTag (tag, ctx) {
  const db = ctx.guild.db
  if (!db.config.tags) db.config.tags = []
  db.config.tags.push(tag)
}

export async function removeTag (tag, ctx) {
  const db = ctx.guild.db
  removeFromArray(db.config.tags, tag)
}
