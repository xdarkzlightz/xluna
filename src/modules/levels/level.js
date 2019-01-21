export function getLevelEXP (level) {
  const exponent = 1.5
  const baseXP = 1000
  return Math.floor(baseXP * Math.pow(level, exponent))
}

export function levelUpReady (lvl, exp) {
  const expToLvl = getLevelEXP(lvl + 1)
  if (exp >= expToLvl) return true
  return false
}

export function randomEXP (max, min) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function serverRank (members, member) {
  const sorted = members.sort((a, b) => a.data.exp - b.data.exp)
  sorted.reverse()

  return sorted.indexOf(member) + 1
}

export function expEnabledForChannel (ctx, channel) {
  const dbChannel = ctx.guild.db.channels.get(channel.id)
  if (dbChannel) return dbChannel.data.expEnabled
  return true
}

export async function updateEXPChannel (ctx, channel) {
  const dbChannel = ctx.guild.db.channels.get(channel.id)

  if (!dbChannel) {
    ctx.guild.db.data.channels.push({ id: channel.id, expEnabled: false })
    await ctx.db.save(ctx.guild.db.data)
  }

  const enabled = dbChannel.data.expEnabled
  dbChannel.data.expEnabled = !enabled
  await ctx.db.save(ctx.guild.db.data)
}
