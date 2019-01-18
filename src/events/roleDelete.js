import { handleRoleDelete } from '@serverutil/events'

module.exports = (client, role) => {
  const db = client.db.guilds.get(role.guild.id)

  handleRoleDelete(role, db)
}
