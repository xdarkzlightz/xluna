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

export async function resetTimers (db) {
  const current = new Date()
  const dayDate = new Date(db.serverstats.lastDayUpdated)
  const weekDate = new Date(db.serverstats.lastWeekUpdated)
  const monthDate = new Date(db.serverstats.lastMonthUpdated)

  await db.update(g => {
    if (
      current.getUTCMonth() >= dayDate.getUTCMonth() &&
      current.getUTCDay() > dayDate.getUTCDay()
    ) {
      g.serverstats.lastDayUpdated = current.toUTCString()
      g.serverstats.joinedDay = 0
      g.serverstats.leftDay = 0
    }

    if (
      current.getUTCMonth() >= weekDate.getUTCMonth() &&
      current.getUTCDate() > weekDate.getUTCDate() + 7
    ) {
      g.serverstats.lastWeekUpdated = current.toUTCString()
      g.serverstats.joinedWeek = 0
      g.serverstats.leftWeek = 0
    }

    if (current.getUTCMonth() > monthDate.getUTCMonth()) {
      g.serverstats.lastMonthUpdated = current.toUTCString()
      g.serverstats.joinedMonth = 0
      g.serverstats.leftMonth = 0
    }
  })
}
