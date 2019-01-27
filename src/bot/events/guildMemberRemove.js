module.exports = async (client, member) => {
  let db = client.db.guilds.get(member.guild.id)
  if (!db) return
  db = db.data

  if (db.config.leave) {
    const channel = member.guild.channels.get(db.config.leave.channelID)
    if (channel) channel.send(`<@${member.id}>, ${db.config.leave.body}`)
  }
}
