import {
  setChannel,
  updateLoggerConfig,
  setWelcomeChannel,
  setLeaveChannel,
  setLeaveMessage,
  setWelcomeMessage,
  setAutoRole
} from '@serverutil/serverutil'

export async function setLoggingChannel (ctx, channel) {
  await setChannel(channel, ctx.db)
  ctx.success(`Set logging channel to: ${channel.name}`)
}

export async function updateLogger (ctx) {
  const updated = await updateLoggerConfig(this.name, ctx.db)
  if (!updated) ctx.error("A logging channel isn't set!")

  ctx.say('Logger updated!')
}

export async function updateWelcomeChannel (ctx, channel) {
  await setWelcomeChannel(channel, ctx.db)
  ctx.success(`Set welcome channel to: ${channel.name}`)
}

export async function updateLeaveChannel (ctx, channel) {
  await setLeaveChannel(channel, ctx.db)
  ctx.success(`Set leave channel to: ${channel.name}`)
}

export async function updateWelcomeMessage (ctx, message) {
  await setWelcomeMessage(message, ctx.db)

  ctx.success(`Setted welcomed message`)
}

export async function updateLeaveMessage (ctx, message) {
  await setLeaveMessage(message, ctx.db)

  ctx.success(`Setted leave message`)
}

export async function updateJoinRole (ctx, role) {
  await setAutoRole(role, ctx.db)

  ctx.success(`Join role set`)
}
