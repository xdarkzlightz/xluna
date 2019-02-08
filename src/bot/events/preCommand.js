import { levelUpReady, randomEXP } from '@modules/levels/level'

module.exports = async (client, ctx) => {
  if (!ctx.guild) return
  const member = ctx.member.db
  const channel = ctx.channel.db

  let leveledUp = false
  let readyToLevel = levelUpReady(member.level, member.exp)
  if (readyToLevel) {
    leveledUp = true
    await member.update(m => (m.level += 1))
    if (channel.expEnabled !== false) {
      ctx
        .say(
          `<@${ctx.member.id}> has reached server level ${member.data.level}`
        )
        .catch()
    }
  }

  let user = ctx.author.db

  readyToLevel = levelUpReady(user.profile.level, user.profile.exp)
  if (readyToLevel) {
    leveledUp = true
    await user.update(u => (u.profile.level += 1))
    if (!channel || channel.data.expEnabled !== false) {
      ctx
        .say(
          `<@${ctx.member.id}> has reached global level ${user.profile.level}`
        )
        .catch()
    }
  }
  if (!ctx.client.levelCooldowns.has(ctx.author.id)) {
    const exp = randomEXP(10, 50)
    if (!channel || (channel.data.expEnabled !== false && !leveledUp)) {
      await member.update(m => (m.exp += exp))
      await user.update(u => (u.profile.exp += exp))
    }
    ctx.client.levelCooldowns.set(ctx.author.id, ctx.author)
    setTimeout(() => {
      ctx.client.levelCooldowns.delete(ctx.author.id)
    }, 60 * 1000)
  }
}
