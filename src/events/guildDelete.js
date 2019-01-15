module.exports = (client, guild) => {
  client.logger.info(`Left guild: ${guild.name} (${guild.id})`)
}
