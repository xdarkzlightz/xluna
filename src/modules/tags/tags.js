import { removeFromArray } from '@eclipse/util/array'

export function getTag (name, ctx) {
  const db = ctx.guild.db.data
  const tag = db.data.config.tags.find(tag => tag.name === name)
  if (!tag) return false
  return tag
}

export async function saveTag (tag, ctx) {
  const db = ctx.guild.db.data
  db.config.tags.push(tag)
  ctx.db.save(db)
}

export async function removeTag (tag, ctx) {
  const db = ctx.guild.db.data
  removeFromArray(db.config.tags, tag)
  ctx.db.save(db)
}
