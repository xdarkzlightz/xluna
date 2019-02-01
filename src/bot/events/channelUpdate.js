import { handleChannelUpdate } from '@modules/serverutil/events'

module.exports = (client, oldChannel, newChannel) => {
  if (!oldChannel.guild) return
  const db = client.db.guilds.get(newChannel.guild.id)
  handleChannelUpdate(oldChannel, newChannel, db)
}
