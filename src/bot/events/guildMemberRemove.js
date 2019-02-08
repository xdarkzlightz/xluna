import { resetTimers } from '@modules/info/info'
module.exports = async (client, member) => {
  const db = client.db.guilds.get(member.guild.id)

  if (db.config.leave) {
    const channel = member.guild.channels.get(db.config.leave.channelID)
    if (channel) channel.send(`<@${member.id}>, ${db.config.leave.body}`)
  }

  await resetTimers(db)
  await db.update(g => {
    g.serverstats.leftDay += 1
    g.serverstats.leftWeek += 1
    g.serverstats.leftMonth += 1
  })
}
