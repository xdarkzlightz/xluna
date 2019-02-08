import { RichEmbed } from 'discord.js'
import { removeFromArray, asyncForEach } from '@util/array'

const createReactionRoleList = ctx => {
  const roles = []
  ctx.guild.db.selfroles.roles.forEach(({ role, emote }) => {
    if (!ctx.guild.roles.has(role)) return
    if (!emote) return
    roles.push(`<@&${role}> - ${emote}\n`)
  })

  return roles
}

export function addSelfRole (ctx, { role }) {
  ctx.guild.db.update(g => g.selfroles.roles.push({ role: role.id }))

  const embed = new RichEmbed()
    .setColor(role.hexColor)
    .setDescription(`Added self role <@&${role.id}>`)

  ctx.say(embed)
}

export async function removeSelfRole (ctx, { role }) {
  const data = ctx.guild.db.selfroles
  const selfrole = ctx.guild.db.selfroles.roles.find(r => r.role === role.id)

  if (!selfrole) {
    return ctx.say("That role hasn't been added as a self role!")
  }

  const emote = `${selfrole.emote}`

  await ctx.guild.db.update(g => removeFromArray(g.selfroles.roles, selfrole))

  if (data.message && data.message !== '') {
    const channel = ctx.guild.channels.get(data.channel)
    const msg = await channel.fetchMessage(data.message)
    const embed = new RichEmbed()
      .setColor(0x483632)
      .setAuthor('Available self roles')
      .setFooter('React down below with the corresponding emote')

    const reaction = msg.reactions.find(r => {
      return r.emoji.name === emote
    })
    if (reaction) reaction.remove()

    const roles = createReactionRoleList(ctx)
    if (!roles.length) {
      embed.setDescription('There are no available roles')
    } else embed.setDescription(roles)

    msg.edit(embed)
  }

  const embed = new RichEmbed()
    .setColor(role.hexColor)
    .setDescription(`Removed self role <@&${role.id}>`)

  ctx.say(embed)
}

export function showSelfRoles (ctx) {
  const embed = new RichEmbed()
    .setColor(0x483632)
    .setAuthor('Available self roles')

  const roles = []
  ctx.guild.db.selfroles.roles.forEach(({ role }) => {
    if (!ctx.guild.roles.has(role)) return
    roles.push(`<@&${role}>\n`)
  })
  if (!roles.length) return ctx.say('There are no self roles available!')

  embed.setDescription(roles.join(''))
  ctx.say(embed)
}

export async function giveSelfRole (ctx, { role }) {
  const selfrole = ctx.guild.db.selfroles.roles.find(r => r.role === role.id)

  if (!selfrole) {
    return ctx.say("That role hasn't been added as a self role!")
  }

  const embed = new RichEmbed().setColor(role.hexColor)

  if (ctx.member.roles.has(role.id)) {
    await ctx.member.removeRole(role)
    embed.setDescription(`You no longer have the <@&${role.id}> role`)
  } else {
    await ctx.member.addRole(role)
    embed.setDescription(`You now have the <@&${role.id}> role`)
  }
  ctx.say(embed)
}

export async function addReactionRole (ctx, { role, emote }) {
  const data = ctx.guild.db.selfroles
  if (data.roles.length === 25) {
    return ctx.say(
      'You have reached the max amount of reaction roles you can have! However you can still use selfroles!'
    )
  }

  let selfrole = data.roles.find(r => r.role === role.id)

  if (!selfrole) {
    await ctx.guild.db.update(g => data.roles.push({ role: role.id, emote }))
    selfrole = data.roles.find(r => r.role === role.id)
  } else if (!selfrole.emote) {
    await ctx.guild.db.update(g => (selfrole.emote = emote))
  } else if (selfrole) return ctx.say('A reaction role already exists!')

  if (data.message && data.message !== '') {
    const channel = ctx.guild.channels.get(data.channel)
    const msg = await channel.fetchMessage(data.message)
    const embed = new RichEmbed()
      .setColor(0x483632)
      .setAuthor('Available self roles')
      .setFooter('React down below with the corresponding emote')
    const roles = createReactionRoleList(ctx)
    embed.setDescription(roles)

    const reaction = msg.reactions.find(r => r.emoji.name === selfrole.emote)
    if (!reaction) msg.react(selfrole.emote)

    msg.edit(embed)
  }

  const embed = new RichEmbed()
    .setColor(role.hexColor)
    .setDescription(`Added reaction role <@&${role.id}> with emote ${emote}`)

  ctx.say(embed)
}

export async function sendReactionMessage (ctx, { channel }) {
  const embed = new RichEmbed()
    .setColor(0x483632)
    .setAuthor('Available self roles')

  const roles = createReactionRoleList(ctx)
  if (!roles.length) return ctx.say(`There are no reaction roles!`)

  embed.setDescription(roles.join(''))
  embed.setFooter('React down below with the corresponding emote')

  channel
    .send(embed)
    .then(async msg => {
      ctx.guild.db.data.selfroles.message = msg.id
      ctx.guild.db.data.selfroles.channel = channel.id
      await asyncForEach(ctx.guild.db.data.selfroles.roles, async r => {
        await msg.react(r.emote)
      })
    })
    .catch(e => {
      ctx.client.logger.error(e)
      ctx.say("Could not send message, I'm probably missing permission")
    })
}
