import { createHelpMessage } from '@eclipse/util/embed'
import { RichEmbed } from 'discord.js'

export const GroupConfig = {
  name: 'info',
  description: 'Info group, contains commands that give you info stuff'
}

export const help = {
  config: {
    aliases: ['h'],
    rating: 0,
    description: 'This is your magical help command',
    usage: 'help'
  },
  async run (ctx) {
    const embed = new RichEmbed().setColor(0x4286f4)
    await createHelpMessage(ctx, embed)
    ctx.say(embed)
  }
}

export const invite = {
  config: {
    rating: 0,
    description: 'Get a bot invite link & a invite to the bots support server!',
    usage: 'invite'
  },
  async run (ctx) {
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
}
