import { levelUpReady, randomEXP } from '@modules/levels/level'

module.exports = async (client, ctx) => {
  if (!ctx.guild) return
  const member = ctx.member.db
  const channel = ctx.channel.db

  let readyToLevel = levelUpReady(member.data.level, member.data.exp)
  if (readyToLevel) {
    member.data.level += 1
    if (!channel || channel.data.expEnabled !== false) {
      ctx.say(
        `<@${ctx.member.id}> has reached server level ${member.data.level}`
      )
    }
  }

  let user = ctx.author.db

  readyToLevel = levelUpReady(user.profile.level, user.profile.exp)
  if (readyToLevel) {
    user.profile.level += 1
    if (!channel || channel.data.expEnabled !== false) {
      ctx.say(
        `<@${ctx.member.id}> has reached global level ${user.profile.level}`
      )
    }
  }
  if (!ctx.client.levelCooldowns.has(ctx.author.id)) {
    const exp = randomEXP(1, 100)
    if (!channel || channel.data.expEnabled !== false) {
      member.data.exp += exp
    }
    user.profile.exp += exp
    ctx.client.levelCooldowns.set(ctx.author.id, ctx.author)
    setTimeout(() => {
      ctx.client.levelCooldowns.delete(ctx.author.id)
    }, 60 * 1000)
  }
}
