// import { levelUpReady, randomEXP } from '@modules/levels/level'

module.exports = async (client, ctx) => {
  // if (!ctx.guild) return
  // if (ctx.guild.db) {
  //   let channel = ctx.guild.db.channels.get(ctx.channel.id)
  //   let member = ctx.guild.db.members.get(ctx.member.id)
  //   if (!member) {
  //     ctx.guild.db.data.members.push({ id: ctx.member.id })
  //     await ctx.db.save(ctx.guild.db.data, ctx)
  //     member = ctx.guild.db.members.get(ctx.member.id)
  //   }
  //   if (member.data.exp === undefined) {
  //     member.data.exp = 0
  //     member.data.level = 1
  //     await ctx.db.save(ctx.guild.db.data, ctx)
  //   }
  //   let readyToLevel = levelUpReady(member.data.level, member.data.exp)
  //   if (readyToLevel) {
  //     member.data.level += 1
  //     await ctx.db.save(ctx.guild.db.data, ctx)
  //     if (!channel || channel.data.expEnabled !== false) {
  //       ctx.say(
  //         `<@${ctx.member.id}> has reached server level ${member.data.level}`
  //       )
  //     }
  //   }
  //   let user = ctx.author.db
  //   if (!user) {
  //     await ctx.db.newUser(ctx)
  //     user = ctx.db.users.get(ctx.author.id)
  //   }
  //   readyToLevel = levelUpReady(user.profile.level, user.profile.exp)
  //   if (readyToLevel) {
  //     user.profile.level += 1
  //     await ctx.db.saveUser(user)
  //     if (!channel || channel.data.expEnabled !== false) {
  //       ctx.say(
  //         `<@${ctx.member.id}> has reached global level ${user.profile.level}`
  //       )
  //     }
  //   }
  //   if (!this.levelCooldowns.has(ctx.author.id)) {
  //     const exp = randomEXP(1, 100)
  //     if (!channel || channel.data.expEnabled !== false) {
  //       member.data.exp += exp
  //       await ctx.db.save(ctx.guild.db.data)
  //     }
  //     user.profile.exp += exp
  //     await ctx.db.saveUser(user)
  //     this.levelCooldowns.set(ctx.author.id, ctx.author)
  //     setTimeout(() => {
  //       this.levelCooldowns.delete(ctx.author.id)
  //     }, 60 * 1000)
  //   }
  // }
}
