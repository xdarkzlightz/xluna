import { RichEmbed } from 'discord.js'

import { createJoinEmbed } from '@eclipse/util/embed'

module.exports = async (client, guild) => {
  client.logger.info(`Joined guild: ${guild.name} (${guild.id})`)

  const embed = new RichEmbed().setColor(0x5742f7)
  await createJoinEmbed(client, embed)
  guild.systemChannel.send(embed).catch()
}
