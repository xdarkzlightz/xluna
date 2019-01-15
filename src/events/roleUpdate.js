import { handleRoleUpdate } from '@serverutil/serverutil'

module.exports = (client, oldRole, newRole) => {
  handleRoleUpdate(oldRole, newRole)
}
