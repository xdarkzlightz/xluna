import { handleChannelUpdate } from '@serverutil/events'

module.exports = (client, oldChannel, newChannel) => {
  const db = client.db.guilds.get(newChannel.guild.id)
  if (!db) return
  handleChannelUpdate(oldChannel, newChannel, db)
}
