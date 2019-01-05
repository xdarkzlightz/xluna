import Guild from './models/guild'
import { createGroups } from '@eclipse/util/database'

export async function addGuild (ctx, rating) {
  const groups = createGroups(ctx.client.registry.groups, rating)
  const config = {
    prefix: ctx.client.prefix,
    rating: rating
  }

  const role = { id: ctx.guild.id, groups }

  const dbGuild = new Guild({
    id: ctx.guild.id.toString(),
    config,
    channels: [],
    roles: [role],
    members: []
  })

  await dbGuild.save()
}

export function setPrefix (prefix, db) {
  db.config.prefix = prefix
}
