import { resetTimers } from '@modules/info/info'

module.exports = async (client, member) => {
  const db = client.db.guilds.get(member.guild.id)

  if (db.config.welcome) {
    const channel = member.guild.channels.get(db.config.welcome.channelID)
    if (channel) channel.send(`<@${member.id}>, ${db.config.welcome.body}`)
  }

  if (db.config.roleID) {
    const role = member.guild.roles.get(db.config.roleID)
    if (role) await member.addRole(role)
  }

  const dbMember = db.members.get(member.id)

  if (!dbMember) return

  if (dbMember.data.nickname) member.setNickname(dbMember.data.nickname)

  await resetTimers(db)
  await db.update(g => {
    g.serverstats.joinedDay += 1
    g.serverstats.joinedWeek += 1
    g.serverstats.joinedMonth += 1
  })
}
