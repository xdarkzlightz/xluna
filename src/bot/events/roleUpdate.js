import { handleRoleUpdate } from '@modules/serverutil/events'

module.exports = (client, oldRole, newRole) => {
  const db = client.db.guilds.get(newRole.guild.id)
  if (db.config.logger) return

  handleRoleUpdate(oldRole, newRole, db)
}
