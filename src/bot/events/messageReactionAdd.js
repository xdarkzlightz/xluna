module.exports = async (client, reaction, user) => {
  const menu = client.reactionMenuManager.getMenu(reaction.message.id)
  if (menu) {
    if (menu.skip) return (menu.skip -= 1)
    const func = menu.functions.get(reaction.emoji.name)
    if (func) {
      try {
        await func(client)
        await reaction.remove(user)
      } catch (e) {}
    }
  }

  if (reaction.message.guild) {
    if (user.bot) return
    const member = reaction.message.guild.members.get(user.id)
    if (!member) return

    const db = client.db.guilds.get(reaction.message.guild.id)
    if (db.data.selfroles.message !== reaction.message.id) return
    const role = db.data.selfroles.roles.find(
      ({ emote }) => reaction.emoji.name === emote
    )
    if (!role) return
    reaction.remove().catch()

    if (!member.roles.has(role.role)) {
      await member.addRole(role.role).catch()
    } else {
      await member.removeRole(role.role).catch()
    }
  }
}
