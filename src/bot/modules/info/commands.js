import { RichEmbed } from 'discord.js'
import { createHelpMessage } from './embed'

export async function sendHelp (ctx) {
  const embed = new RichEmbed().setColor(0x4286f4)
  await createHelpMessage(ctx, embed)
  ctx.say(embed)
}

export async function sendInvite (ctx) {
  const embed = new RichEmbed()
    .setColor(0x4286f4)
    .setAuthor('Here are your invites!', ctx.client.user.avatarURL)
    .addField(
      'Invites',
      `[Support Server](${ctx.client.supportServer})\n[Bot Invite](${
        ctx.client.botInvite
      })`
    )
  ctx.say(embed)
}

export async function sendBotInfo (ctx) {
  const app = await ctx.client.fetchApplication()

  const embed = new RichEmbed()
    .setColor(0x4286f4)
    .setAuthor("Here's my info!", ctx.client.user.avatarURL)
    .addField('Owner', `${app.owner.tag}`)
    .setThumbnail(app.owner.avatarURL)
    .addField('Total Servers', `${ctx.client.guilds.size}`, true)
    .addField('Total members', `${ctx.client.users.size}`, true)
    .addField('Lib', '[discord.js](https://discord.js.org/#/)', true)
    .addField(
      'Command Framework',
      '[Eclipse-Engine](https://github.com/xdarkzlightz/xluna/tree/master/src/eclipse-engine)',
      true
    )
    .setFooter(`Version: ${ctx.client.version}`)
  ctx.say(embed)
}

export async function sendServerInfo (ctx) {
  const guild = await ctx.guild.fetchMembers()

  const humans = guild.members.filter(member => !member.user.bot)
  const bots = guild.members.filter(member => member.user.bot)
  const online = guild.members.filter(
    member => member.presence.status === 'online'
  )
  const textChannels = ctx.guild.channels.filter(
    channel => channel.type === 'text'
  )
  const voiceChannels = ctx.guild.channels.filter(
    channel => channel.type === 'voice'
  )
  const categoryChannels = ctx.guild.channels.filter(
    channel => channel.type === 'category'
  )

  const embed = new RichEmbed()
    .setAuthor(`${ctx.guild.name} (${ctx.guild.id})`, ctx.guild.iconURL)
    .setColor(0x6542f4)
    .setThumbnail(ctx.guild.iconURL)
    .addField('Owner', ctx.guild.owner.user.tag, true)
    .addField('Owner ID', ctx.guild.owner.id, true)
    .addField(
      'Members',
      `Total: ${guild.members.size}\nHumans: ${humans.size}\nBots: ${
        bots.size
      }\nOnline ${online.size}`,
      true
    )
    .addField(
      'Channels',
      `Total: ${ctx.guild.channels.size}\nText: ${textChannels.size}\nVoice: ${
        voiceChannels.size
      }\nCategory: ${categoryChannels.size}`,
      true
    )
    .addField('Roles', `Total: ${ctx.guild.roles.size}`, true)
    .addField('Voice Region', ctx.guild.region, true)
    .setFooter(`Server created on: ${ctx.guild.createdAt.toUTCString()}`)

  ctx.say(embed)
}

export function sendMemberInfo (ctx, member) {
  const embed = new RichEmbed()
    .setAuthor(
      `${member.user.tag} (${member.id})`,
      member.user.displayAvatarURL
    )
    .setDescription(`<@${member.id}>`)
    .setColor(0x6542f4)
    .setThumbnail(member.user.avatarURL)
    .addField('Nickname', `${member.nickname ? member.nickname : 'N/A'}`, true)
    .addField('Bot', member.user.bot ? 'Yes' : 'No', true)
    .addField(
      'Playing',
      member.presence.game ? member.presence.game.name : 'Not playing anything'
    )
    .addField(
      'Roles',
      `${member.roles
        .filter(r => r.id !== ctx.guild.id)
        .map(roles => `<@&${roles.id}>`)
        .join(' | ') || 'No Roles'}`
    )
    .addField('Registered', member.user.createdAt.toUTCString())
    .addField('Joined', member.joinedAt.toUTCString())
  ctx.say(embed)
}

export function sendChannelInfo (ctx, channel) {
  const embed = new RichEmbed()
    .setAuthor(`${channel.name} (${channel.id})`)
    .setDescription(`<#${channel.id}>`)
    .setColor(0x6542f4)
    .addField('type', channel.type, true)
    .addField('Category', channel.parent ? channel.parent.name : 'None', true)
    .addField('Created on', channel.createdAt.toUTCString())
  ctx.say(embed)
}

export function sendRoleInfo (ctx, role) {
  const embed = new RichEmbed()
    .setAuthor(`${role.name} (${role.id})`)
    .setDescription(`<@&${role.id}>`)
    .setColor(role.hexColor)
    .addField('colour', role.hexColor, true)
    .addField('hoisted', role.hoist ? 'Yes' : 'No', true)
    .addField('mentionable', role.mentionable ? 'Yes' : 'No', true)
    .addField('Created on', role.createdAt.toUTCString())
  ctx.say(embed)
}

export async function sendMemberCount (ctx) {
  const guild = await ctx.guild.fetchMembers()

  const humans = guild.members.filter(member => !member.user.bot)
  const bots = guild.members.filter(member => member.user.bot)
  const online = guild.members.filter(
    member => member.presence.status === 'online'
  )

  const embed = new RichEmbed()
    .setAuthor(`Member count!`, ctx.guild.iconURL)
    .setColor(0x6542f4)
    .setDescription(
      `**Total:** ${guild.members.size}\n\n**Humans:** ${
        humans.size
      }\n\n**Bots:** ${bots.size}\n\n**Online:** ${online.size}`
    )
  ctx.say(embed)
}
