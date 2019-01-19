import { handleRoleUpdate } from '@serverutil/events'

module.exports = (client, oldRole, newRole) => {
  const db = client.db.guilds.get(newRole.guild.id)
  if (!db || db.config.logger) return

  handleRoleUpdate(oldRole, newRole, db)
}
