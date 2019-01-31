import { RichEmbed } from 'discord.js'
import { serverRank, updateEXPChannel, getLevelEXP } from './level'

export function sendLevel (ctx) {
  const member = ctx.guild.db.members.get(ctx.member.id)
  const members = ctx.guild.db.members.array().slice()
  const rank = serverRank(members, member)

  const embed = new RichEmbed()
    .setAuthor(ctx.author.tag, ctx.author.avatarURL)
    .setDescription(`Server rank #${rank}`)
    .setThumbnail(ctx.author.avatarURL)
    .setColor(0x5936e7)
    .addField('Server Level', `Lvl. ${member.data.level}`, true)
    .addField(
      'Server progress',
      `${member.data.exp}/${getLevelEXP(
        member.data.level + 1
      )} till Lvl. ${member.data.level + 1}`,
      true
    )

  ctx.say(embed)
}

export function updateChannel (ctx, { channel }) {
  updateEXPChannel(ctx, channel)
  const enabled = ctx.guild.db.channels.get(channel.id).data.expEnabled

  ctx.say(
    `Channel ${channel.name} was ${enabled ? 'enabled' : 'disabled'} for exp`
  )
}

export function expTo (ctx, { level }) {
  ctx.say(`Level ${level} requires ${getLevelEXP(level)} exp!`)
}
