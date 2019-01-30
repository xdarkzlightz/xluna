import { RichEmbed } from 'discord.js'
import { createPageOne } from './embed'
import { createGroupHelp } from '@engines/eclipse/util/embed'

export async function help (ctx) {
  const embed = new RichEmbed().setColor(0x4286f4)
  await createPageOne(ctx, embed)

  const msg = await ctx.say(embed)
  await msg.react('◀')
  await msg.react('▶')

  const menu = ctx.client.reactionMenuManager.addMenu(msg, 60 * 1000)
  menu.skip = 1

  menu.pos = -1

  menu.addFunc('◀', async client => {
    if (menu.pos === 0) {
      const embed = new RichEmbed().setColor(0x4286f4)
      await createPageOne(ctx, embed)
      await msg.edit(embed)
    } else {
      menu.pos -= 1
      const group = client.registry.groups.array()[menu.pos]
      const embed = new RichEmbed().setColor(0x4286f4)
      await createGroupHelp(ctx.prefix, group, embed)
      await msg.edit(embed)
    }
  })

  menu.addFunc('▶', async client => {
    if (menu.pos + 1 > client.registry.groups.size - 1) {
    } else {
      menu.pos += 1
      const group = client.registry.groups.array()[menu.pos]
      const embed = new RichEmbed().setColor(0x4286f4)
      await createGroupHelp(ctx.prefix, group, embed)
      await msg.edit(embed)
    }
  })
}
