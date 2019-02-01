import {
  setChannel,
  updateLoggerConfig,
  setWelcomeChannel,
  setLeaveChannel,
  setLeaveMessage,
  setWelcomeMessage,
  setAutoRole,
  deleteWelcome,
  deleteLeave,
  deleteAutoRole,
  deleteLogger
} from './serverutil'

export async function setLoggingChannel (ctx, { channel }) {
  await setChannel(channel, ctx)
  ctx.success(`Set logging channel to: ${channel.name}`)
}

export async function updateLogger (ctx) {
  const updated = await updateLoggerConfig(this.name, ctx)
  if (!updated) return ctx.error("A logging channel isn't set!")

  ctx.say('Logger updated!')
}

export async function removeLogger (ctx) {
  await deleteLogger(ctx)
  ctx.success(`Removed the logging channel`)
}

export async function updateWelcomeChannel (ctx, { channel }) {
  await setWelcomeChannel(channel, ctx)
  ctx.success(`Set welcome channel to: ${channel.name}`)
}

export async function removeWelcome (ctx) {
  await deleteWelcome(ctx)
  ctx.success(`Removed the welcome channel`)
}

export async function updateLeaveChannel (ctx, { channel }) {
  await setLeaveChannel(channel, ctx)
  ctx.success(`Set leave channel to: ${channel.name}`)
}

export async function updateWelcomeMessage (ctx, message) {
  await setWelcomeMessage(message, ctx)

  ctx.success(`Set welcomed message`)
}

export async function removeLeave (ctx) {
  await deleteLeave(ctx)
  ctx.success(`Removed the leave channel`)
}

export async function updateLeaveMessage (ctx, { message }) {
  await setLeaveMessage(message, ctx)

  ctx.success(`Set leave message`)
}

export async function updateJoinRole (ctx, { role }) {
  await setAutoRole(role, ctx)

  ctx.success(`Set join role`)
}

export async function removeAutorole (ctx) {
  await deleteAutoRole(ctx)
  ctx.success(`Removed the auto-role`)
}
