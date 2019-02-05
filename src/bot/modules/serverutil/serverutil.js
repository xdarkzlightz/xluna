export async function setChannel (channel, ctx) {
  const db = ctx.guild.db
  if (!db.config.logger) db.logger = {}
  await db.update(g => (g.logger.channelID = channel.id))
}

export async function updateLoggerConfig (target, ctx) {
  const db = ctx.guild.db

  if (!db.logger || !db.logger.channelID) return false

  let [type, action] = target.split('-')

  if (action) action = action.replace(/^\w/, c => c.toUpperCase())

  let enabling = true
  await db.update(g => {
    if (g.logger[`${type}${action || ''}`]) enabling = false

    g.logger[`${type}${action || ''}`] = enabling
  })

  return true
}

export async function deleteLogger (ctx) {
  const db = ctx.guild.db
  if (!db.logger) return

  await db.update(g => (g.logger.channelID = ''))
}

export async function setWelcomeChannel (channel, ctx) {
  const db = ctx.guild.db

  if (!db.welcome) db.welcome = { body: 'welcome to the server' }
  await db.update(g => (g.onJoin.welcome.channelID = channel.id))
}

export async function setWelcomeMessage (body, ctx) {
  const db = ctx.guild.db

  if (!db.welcome) db.onJoin.welcome = {}
  await db.update(g => (g.onJoin.welcome.body = body))
}
export async function deleteWelcome (ctx) {
  const db = ctx.guild.db

  if (!db.onJoin.welcome) return

  await db.update(g => (g.onJoin.welcome.channelID = ''))
}

export async function setLeaveChannel (channel, ctx) {
  const db = ctx.guild.db

  if (!db.leave) db.onLeave.leave = { body: 'has left!' }

  await db.update(g => (g.onLeave.eave.channelID = channel.id))
}

export async function deleteLeave (ctx) {
  const db = ctx.guild.db

  if (!db.onLeave.leave) return

  await db.update(g => (g.onLeave.leave.channelID = ''))
}

export async function setLeaveMessage (body, ctx) {
  const db = ctx.guild.db

  if (!db.onLeave.leave) db.onLeave.leave = {}

  await db.update(g => (g.onLeave.leave.body = body))
}

export async function setAutoRole (role, ctx) {
  const db = ctx.guild.db

  await db.update(g => (g.onJoin.autorole = role.id))
}

export async function deleteAutoRole (ctx) {
  const db = ctx.guild.db

  await db.update(g => (g.onJoin.autorole = ''))
}
