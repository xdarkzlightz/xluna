import { getTag, saveTag, removeTag } from '@tags/tags'

export function sendTag (ctx, { name }) {
  const tag = getTag(name, ctx)
  if (!tag) {
    return ctx.error(`Could not find a tag with the name of: ${name}!`)
  }

  ctx.say(tag.body)
}

export async function createTag (ctx, { name, body }) {
  const tag = getTag(name, ctx)
  if (tag) return ctx.error(`A tag with the name of ${name} already exists!`)

  await saveTag({ name, body }, ctx)

  ctx.success('Tag created!')
}

export async function deleteTag (ctx, name) {
  const tag = getTag(name, ctx)
  if (!tag) {
    return ctx.error(`Could not find a tag with the name of ${name}!`)
  }

  await removeTag(tag, ctx)

  ctx.success('Tag deleted!')
}
