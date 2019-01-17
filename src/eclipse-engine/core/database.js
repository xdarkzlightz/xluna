import { RichEmbed } from 'discord.js'

export async function setCommandEnabledTo (ctx, arg) {
  if (ctx.cmd.devOnly) return
  const [action] = this.name.split('-')
  const enabling = action === 'enable'

  ctx.client.logger.info(
    `[Database]: ${action.substring(0, action.length - 1)}ing command: ${
      ctx.cmd.name
    } for ${ctx.guild.id}`
  )

  const guild = ctx.guild.db
  await ctx.db.updateCommand(this.arg.type, ctx, arg, enabling, guild)

  const name = arg.user ? arg.user.username : arg.name
  ctx.success(`Command: ${ctx.cmd.name} ${action}d for ${name}!`)
}

export function commandStatus (ctx, arg) {
  if (ctx.cmd.devOnly) return
  const name = arg.user ? arg.user.username : arg.name
  const type = ctx.guild.db[`${this.arg.type}s`].get(arg.id)
  if (!type) {
    return ctx.error(`Config not found for ${name}!`)
  }

  const enabled = type.commands.get(ctx.cmd.name).enabled
  const msg = enabled ? 'enabled' : 'disabled'
  ctx.success(`Command: ${ctx.cmd.name} is ${msg} for ${name}!`)
}

export async function setGroupEnabledTo (ctx, arg) {
  if (ctx.group.devOnly) return
  const [action] = this.name.split('-')
  const enabling = action === 'enable'

  ctx.client.logger.info(
    `[Database]: ${action.substring(0, action.length - 1)}ing group: ${
      ctx.group.name
    } for ${ctx.guild.id}`
  )

  await ctx.db.updateGroup(
    this.arg.type,
    arg.id,
    ctx.group,
    enabling,
    ctx.guild.db
  )

  const name = arg.user ? arg.user.username : arg.name
  ctx.success(`Group: ${ctx.group.name} ${action}d for ${name}!`)
}

export function groupStatus (ctx, arg) {
  if (ctx.group.devOnly) return
  const name = arg.user ? arg.user.username : arg.name

  const type = ctx.guild.db[`${this.arg.type}s`].get(arg.id)
  if (!type) {
    return ctx.error(`Config not found for ${name}!`)
  }

  const embed = new RichEmbed().setAuthor(ctx.group.name).setColor(0x57e69)
  let commands = ''
  ctx.group.commands.forEach(cmd => {
    const enabled = type.commands.get(cmd.name).enabled
    const msg = enabled ? 'enabled' : 'disabled'
    commands += `**${cmd.name}**: *${msg}*\n`
  })
  embed.addField('commands', commands)
  ctx.say(embed)
}

export async function clear (ctx, arg) {
  if (ctx.cmd.devOnly) return
  if (arg.id === ctx.guild.id) return
  const name = arg.user ? arg.user.username : arg.name

  const type = ctx.guild.db[`${this.arg.type}s`].get(arg.id)
  if (!type) {
    return ctx.error(`Config not found for ${name}!`)
  }

  ctx.success(`Config has been cleared for ${name}!`)
}
