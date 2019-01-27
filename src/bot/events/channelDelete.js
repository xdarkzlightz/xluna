import { handleChannelDelete } from '@serverutil/events'

module.exports = (client, channel) => {
  const db = client.db.guilds.get(channel.guild.id)
  if (!db) return
  handleChannelDelete(channel, db)
}
