export async function joinChannel (ctx) {
  try {
    if (ctx.member.voiceChannel) {
      if (ctx.msg.guild.voiceConnection) {
        return ctx.say('Already connected to your voice channel')
      }
      await ctx.member.voiceChannel.join()
      ctx.say('Connected to your voice channel')
    } else {
      ctx.say('You must be in a voice channel for me to join')
    }
  } catch (e) {
    ctx.client.logger.error(`Error: ${e}\nStacktrace: ${e.stack}`)
  }
}

export async function leaveChannel (ctx) {
  try {
    if (ctx.member.voiceChannel) {
      if (!ctx.msg.guild.voiceConnection) {
        return ctx.say('I must be in a voice channel to leave it')
      }
      await ctx.member.voiceChannel.leave()
      ctx.say('Left your voice channel')
    } else {
      ctx.say('You must be in a voice channel for me to leave')
    }
  } catch (e) {
    ctx.client.logger.error(`Error: ${e}\nStacktrace: ${e.stack}`)
  }
}

export function playSong (ctx) {
  const connection = ctx.guild.voiceConnection
  ctx.client.music.play(connection, '')
}
