import { handleMemberUpdate } from '@serverutil/events'

module.exports = (client, oldMember, member) => {
  if (!member.guild) return
  const db = client.db.guilds.get(member.guild.id)
  if (!db || !db.config.logger) return
  handleMemberUpdate(oldMember, member, db)
}
