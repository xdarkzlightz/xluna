export function sendTag (ctx, { name }) {
  const tag = ctx.client.tags.get(name)
  if (!tag) {
    return ctx.error(`Could not find a tag with the name of: ${name}!`)
  }

  ctx.say(tag)
}

export function createTag (ctx, { name, body }) {
  const tag = ctx.client.tags.get(name)
  if (tag) return ctx.error(`A tag with the name of ${name} already exists!`)

  ctx.client.tags.set(name, body)

  ctx.success('Tag created!')
}

export function deleteTag (ctx, { name }) {
  const tag = ctx.client.tags.get(name)
  if (!tag) {
    return ctx.error(`Could not find a tag with the name of ${name}!`)
  }

  ctx.client.tags.delete(name)

  ctx.success('Tag deleted!')
}
