import { setChannel, updateLoggerConfig } from '@serverutil/serverutil'

export async function setLoggingChannel (ctx, channel) {
  await setChannel(channel, ctx.db)
  ctx.success(`Set logging channel to: ${channel.name}`)
}

export async function updateLogger (ctx) {
  const updated = await updateLoggerConfig(this.name, ctx.db)
  if (!updated) ctx.error("A logging channel isn't set!")

  ctx.say('Logger updated!')
}
