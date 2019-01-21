import { sendLevel, updateChannel } from '@levels/commands'

export const GroupConfig = {
  name: 'levels',
  description: 'Commands for a level system!'
}

export const rank = {
  config: {
    description: 'Check what level you are!',
    usage: 'rank'
  },
  run: sendLevel
}

export const expchannel = {
  config: {
    description: 'Update a exp channel',
    usage: 'updateChannel',
    args: [
      {
        type: 'channel',
        name: 'channel'
      }
    ]
  },
  run: updateChannel
}
