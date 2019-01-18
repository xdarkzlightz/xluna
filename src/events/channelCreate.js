import { handleChannelCreate } from '@serverutil/events'

module.exports = (client, channel) => {
  if (!channel.guild) return
  const db = client.db.guilds.get(channel.guild.id)
  handleChannelCreate(channel, db)
}
