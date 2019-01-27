import { sendLevel, updateChannel, expTo } from '@modules/levels/commands'

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
    memberPermissions: ['MANAGE_CHANNELS'],
    args: [
      {
        type: 'channel',
        name: 'channel'
      }
    ]
  },
  run: updateChannel
}

export const exp = {
  config: {
    description: 'Checks how much exp until a certain level',
    usage: 'exp (number)',
    example: 'exp 10',
    args: [
      {
        type: 'number',
        name: 'level'
      }
    ]
  },
  run: expTo
}
