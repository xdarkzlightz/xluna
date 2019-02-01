import { handleChannelDelete } from '@modules/serverutil/events'

module.exports = (client, channel) => {
  if (!channel.guild) return
  const db = client.db.guilds.get(channel.guild.id)
  handleChannelDelete(channel, db)
}
