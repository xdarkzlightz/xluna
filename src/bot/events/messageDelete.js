import { handleMessageDelete } from '@modules/serverutil/events'

module.exports = (client, message) => {
  if (!message.guild) return
  const db = client.db.guilds.get(message.guild.id)
  if (db.config.logger) return

  handleMessageDelete(message, db)
}
