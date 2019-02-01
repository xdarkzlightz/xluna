import { handleMemberUpdate } from '@modules/serverutil/events'

module.exports = (client, oldMember, member) => {
  if (!member.guild) return
  const db = client.db.guilds.get(member.guild.id)
  if (!db.config.logger) return
  handleMemberUpdate(oldMember, member, db)
}
