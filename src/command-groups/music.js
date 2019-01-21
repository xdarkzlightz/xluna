import { joinChannel, leaveChannel, playSong } from '@music/commands'

export const GroupConfig = {
  name: 'music',
  description: 'Commands that let you play music!',
  aliases: ['m'],
  parent: true
}

export const join = {
  config: {
    description: 'Joins your voice channel',
    usage: 'join'
  },
  run: joinChannel
}

export const leave = {
  config: {
    description: 'Leaves your voice channel',
    usage: 'leave'
  },
  run: leaveChannel
}

export const play = {
  config: {
    description: 'play a song',
    usage: 'play'
  },
  run: playSong
}
