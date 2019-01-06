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
