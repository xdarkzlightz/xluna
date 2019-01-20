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

export function showEnabled (ctx, _type) {
  if (ctx.group.devOnly) return

  const type = ctx.guild.db[`${_type}s`]

  const embed = new RichEmbed()
    .setAuthor(`${_type}s that have: ${ctx.cmd.name} enabled`)
    .setColor(0x57e69)
  let commands = ''
  type.forEach(t => {
    let types = []
    t.commands.forEach(c =>
      c.enabled && c.name === ctx.cmd.name ? types.push(t.data.id) : undefined
    )
    if (!types.length) return

    const msg = types
      .map(t => {
        if (_type === 'role') return `<@&${t}> (${t})\n`
        if (_type === 'channel') return `<@#${t}> (${t})\n`
        if (_type === 'member') return `<@${t}> (${t})\n`
      })
      .join('')
    commands += msg
  })
  if (commands === '') {
    embed.setDescription(
      `There are no ${_type}s enabled for this command or a config wasn't found`
    )
  } else {
    embed.addField('roles', commands)
  }

  ctx.say(embed)
}

export function groupShowEnabled (ctx, _type) {
  if (ctx.group.devOnly) return

  const type = ctx.guild.db[`${_type}s`]

  const embed = new RichEmbed()
    .setAuthor(`Showing roles for the ${ctx.group.name} group`)
    .setColor(0x57e69)

  ctx.group.commands.forEach(c => {
    let typesEnabled = ''
    type.forEach(t => {
      const id = t.data.id
      const enabled = t.commands.get(c.name)
      if (!enabled) return

      if (_type === 'role') typesEnabled += `<@&${id}>\n`
      if (_type === 'channel') typesEnabled += `<@#${id}>\n`
      if (_type === 'member') typesEnabled += `<@${id}>\n`
    })
    if (typesEnabled === '') typesEnabled = 'Nothing has this command enabled'
    embed.addField(c.name, typesEnabled, true)
  })

  ctx.say(embed)
}
