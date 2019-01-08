import { RichEmbed } from 'discord.js'
import { createHelpMessage } from '@eclipse/info/embed'

export async function sendHelp (ctx) {
  const embed = new RichEmbed().setColor(0x4286f4)
  await createHelpMessage(ctx, embed)
  ctx.say(embed)
}

export async function sendInvite (ctx) {
  const app = await ctx.client.fetchApplication()

  const embed = new RichEmbed()
    .setColor(0x4286f4)
    .setAuthor('Here are your invites!', ctx.client.user.avatarURL)
    .addField(
      'Invites',
      `[Support Server](${ctx.client.supportServer})\n[Bot Invite](${
        ctx.client.botInvite
      })`
    )
    .setFooter(`Bot created by: ${app.owner.tag}`, app.owner.avatarURL)
  ctx.say(embed)
}
