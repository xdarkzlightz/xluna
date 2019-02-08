import { RichEmbed } from 'discord.js'
import { serverRank, updateEXPChannel, getLevelEXP } from './level'

export function sendLevel (ctx, { member }) {
  const members = ctx.guild.db.members.array().slice()
  const rank = serverRank(members, member.db)

  const embed = new RichEmbed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL)
    .setDescription(`Server rank #${rank}`)
    .setThumbnail(member.user.displayAvatarURL)
    .setColor(0x5936e7)
    .addField('Server Level', `Lvl. ${member.db.level}`, true)
    .addField(
      'Server progress',
      `${member.db.exp}/${getLevelEXP(member.db.level + 1)} till Lvl. ${member
        .db.level + 1}`,
      true
    )

  ctx.say(embed)
}

export async function updateChannel (ctx, { channel }) {
  await updateEXPChannel(ctx, channel)
  const enabled = ctx.guild.db.channels.get(channel.id).expEnabled

  ctx.say(
    `Channel ${channel.name} was ${enabled ? 'enabled' : 'disabled'} for exp`
  )
}

export function expTo (ctx, { level }) {
  ctx.say(`Level ${level} requires ${getLevelEXP(level)} exp!`)
}
