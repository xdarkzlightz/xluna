import { handleMessageUpdate } from '@modules/serverutil/events'

module.exports = (client, oldMessage, newMessage) => {
  if (!newMessage.guild) return
  const db = client.db.guilds.get(newMessage.guild.id)
  if (!db.config.logger) return
  handleMessageUpdate(oldMessage, newMessage, db)
}
