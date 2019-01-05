import { updateCommandInChannel, commandEnabledInChannel } from './channel'

import { updateCommandInRole, commandEnabledInRole } from './role'

import { updateCommandInMember, commandEnabledInMember } from './member'
import { findID, removeFromArray } from '@eclipse/util/array'

export { default as Guild } from './models/guild'

export { setPrefix, addGuild } from './guild.js'

export function commandEnabledFor (type, id, cmd, db) {
  const args = [id, cmd, db]
  switch (type) {
    case 'channel':
      return commandEnabledInChannel(...args)
    case 'role':
      return commandEnabledInRole(...args)
    case 'member':
      return commandEnabledInMember(...args)
  }
}

const updateCommandFor = (type, id, cmd, enabled, db) => {
  const args = [id, cmd, enabled, db]
  switch (type) {
    case 'channel':
      return updateCommandInChannel(...args)
    case 'role':
      return updateCommandInRole(...args)
    case 'member':
      return updateCommandInMember(...args)
  }
}

export async function setEnabledTo (ctx, arg) {
  const [action] = this.name.split('-')
  const enabling = action === 'enable'

  ctx.client.logger.info(
    `[Database]: ${action.substring(0, action.length - 1)}ing command: ${
      ctx.cmd.name
    } for ${ctx.guild.id}`
  )

  updateCommandFor(this.arg.type, arg.id, ctx.cmd, enabling, ctx.db)
  await ctx.db.save()

  const name = arg.user ? arg.user.username : arg.name
  ctx.success(`Command: ${ctx.cmd.name} ${action}d for ${name}!`)

  return true
}

export async function clear (ctx, arg) {
  if (arg.id === ctx.guild.id) return
  const name = arg.user ? arg.user.username : arg.name

  const obj = findID(ctx.db[`${this.arg.type}s`], arg.id)
  if (!obj) return ctx.error(`Could not find a config for ${name}`)

  removeFromArray(ctx.db[`${this.arg.type}s`], obj)
  await ctx.db.save()

  ctx.success(`Config has been cleared for ${name}!`)
}

export function status (ctx, arg) {
  const name = arg.user ? arg.user.username : arg.name

  let config = findID(ctx.db[`${this.arg.type}s`], arg.id)
  if (!config) {
    return ctx.error(`Config not found for ${name}!`)
  }

  const enabled = commandEnabledFor(this.arg.type, arg.id, ctx.cmd, ctx.db)

  const msg = enabled ? 'enabled' : 'disabled'
  ctx.success(`Command: ${ctx.cmd.name} is ${msg} for ${name}!`)
}
