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
  return channel.data.expEnabled
}

export function updateEXPChannel (ctx, channel) {
  const enabled = channel.data.expEnabled
  channel.data.expEnabled = !enabled
}
