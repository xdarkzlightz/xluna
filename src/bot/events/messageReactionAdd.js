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
}
