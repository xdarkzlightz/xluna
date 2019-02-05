import { removeFromArray } from '@util/array'

export function getTag (name, ctx) {
  const db = ctx.guild.db
  if (!db.tags) return false

  const tag = db.tags.find(tag => tag.name === name)
  if (!tag) return false
  return tag
}

export async function saveTag (tag, ctx) {
  const db = ctx.guild.db
  if (!db.tags) db.tags = []
  await db.update(g => g.tags.push(tag))
}

export async function removeTag (tag, ctx) {
  const db = ctx.guild.db
  db.update(g => removeFromArray(g.tags, tag))
}
