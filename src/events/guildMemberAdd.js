import { findID } from '@eclipse/util/array'

module.exports = async (client, member) => {
  const db = await Guild.findOne({ id: member.guild.id })
  if (db.config.welcome) {
    const channel = member.guild.channels.get(db.config.welcome.channelID)
    if (channel) channel.send(`<@${member.id}>, ${db.config.welcome.body}`)
  }

  if (db.config.roleID) {
    const role = member.guild.roles.get(db.config.roleID)
    if (role) await member.addRole(role)
  }

  const dbMember = findID(db.members, member.id)

  if (!dbMember) return

  if (dbMember.nickname) member.setNickname(dbMember.nickname)
}
