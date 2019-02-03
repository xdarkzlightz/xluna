import migrate from '../migrations/1.5'
import { asyncForEach } from 'util/array'

module.exports = async client => {
  client.logger.info(
    `[xluna]: Bot ready on ${client.guilds.size} guilds, ${
      client.users.size
    } total members`
  )

  client.user.setActivity(
    `${client.prefix}help | In ${client.guilds.size} servers!`
  )

  await client.db.updateGuilds(migrate)

  asyncForEach(client.db.guilds.array(), async guild => {
    if (guild.data.selfroles.message && guild.data.selfroles.message !== '') {
      const channel = client.guilds
        .get(guild.data.id)
        .channels.get(guild.data.selfroles.channel)
      await channel.fetchMessages({ limit: 100 })
    }
  })
}
