import { RichEmbed } from 'discord.js'
import { serverRank, updateEXPChannel } from '@levels/level'

export function sendLevel (ctx) {
  const member = ctx.guild.db.members.get(ctx.member.id)
  const members = ctx.guild.db.members.array().slice()
  const rank = serverRank(members, member)

  const embed = new RichEmbed()
    .setAuthor(ctx.author.tag, ctx.author.avatarURL)
    .setDescription(`**Here are your levels!**\n**Server rank #${rank}**`)
    .setThumbnail(ctx.author.avatarURL)
    .setColor(0x5936e7)
    .addField('Level', member.data.level, true)
    .addField('Total EXP', member.data.exp, true)

  ctx.say(embed)
}

export async function updateChannel (ctx, { channel }) {
  await updateEXPChannel(ctx, channel)
  const enabled = ctx.guild.db.channels.get(channel.id).data.expEnabled

  ctx.say(
    `Channel ${channel.name} was ${enabled ? 'enabled' : 'disabled'} for exp`
  )
}
