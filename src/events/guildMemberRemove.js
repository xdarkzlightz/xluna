import { Guild } from '@eclipse/database'

module.exports = async (client, member) => {
  const db = await Guild.findOne({ id: member.guild.id })
  if (db.config.leave) {
    const channel = member.guild.channels.get(db.config.leave.channelID)
    if (channel) channel.send(`<@${member.id}>, ${db.config.leave.body}`)
  }
}
