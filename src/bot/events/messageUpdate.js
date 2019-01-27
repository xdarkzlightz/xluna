import { handleMessageUpdate } from '@serverutil/events'

module.exports = (client, oldMessage, newMessage) => {
  if (!newMessage.guild) return
  const db = client.db.guilds.get(newMessage.guild.id)
  if (!db || !db.config.logger) return
  handleMessageUpdate(oldMessage, newMessage, db)
}
