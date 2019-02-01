export async function setChannel (channel, ctx) {
  const db = ctx.guild.db
  if (!db.config.logger) db.config.logger = {}
  db.config.logger.channelID = channel.id
}

export async function updateLoggerConfig (target, ctx) {
  const db = ctx.guild.db

  if (!db.config.logger || !db.config.logger.channelID) return false

  let [type, action] = target.split('-')

  if (action) action = action.replace(/^\w/, c => c.toUpperCase())

  let enabling = true
  if (db.config.logger[`${type}${action || ''}`]) enabling = false

  db.config.logger[`${type}${action || ''}`] = enabling

  return true
}

export async function deleteLogger (ctx) {
  const db = ctx.guild.db
  if (!db.logger) return
  db.config.logger.channelID = ''
}

export async function setWelcomeChannel (channel, ctx) {
  const db = ctx.guild.db

  if (!db.config.welcome) db.config.welcome = { body: 'welcome to the server' }
  db.config.welcome.channelID = channel.id
}

export async function setWelcomeMessage (body, ctx) {
  const db = ctx.guild.db

  if (!db.config.welcome) db.config.welcome = {}
  db.config.welcome.body = body
}
export async function deleteWelcome (ctx) {
  const db = ctx.guild.db

  if (!db.config.welcome) return

  db.config.welcome.channelID = ''
}

export async function setLeaveChannel (channel, ctx) {
  const db = ctx.guild.db

  if (!db.config.leave) db.config.leave = { body: 'has left!' }

  db.config.leave.channelID = channel.id
}

export async function deleteLeave (ctx) {
  const db = ctx.guild.db

  if (!db.config.leave) return

  db.config.leave.channelID = ''
}

export async function setLeaveMessage (body, ctx) {
  const db = ctx.guild.db

  if (!db.config.leave) db.config.leave = {}

  db.config.leave.body = body
}

export async function setAutoRole (role, ctx) {
  const db = ctx.guild.db

  db.config.roleID = role.id
}

export async function deleteAutoRole (ctx) {
  const db = ctx.guild.db

  db.config.roleID = ''
}
