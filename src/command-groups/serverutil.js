import { setLoggingChannel, updateLogger } from '@serverutil/commands'

export const GroupConfig = {
  name: 'serverutil',
  description: 'Commands that provide utilities for your server'
}

export const log = {
  config: {
    description: 'A command for logging',
    usage: 'log',
    flags: [
      {
        name: 'set-channel',
        aliases: ['sc'],
        description: 'Set the logging channel',
        usage: 'log --sc',
        arg: { type: 'channel' },
        run: setLoggingChannel
      },
      {
        name: 'channel-create',
        aliases: ['cc'],
        description: 'Think of a clever description',
        usage: 'log --cc',
        run: updateLogger
      },
      {
        name: 'channel-update',
        aliases: ['cu'],
        description: 'Think of a clever description',
        usage: 'log --cu',
        run: updateLogger
      },
      {
        name: 'channel-delete',
        aliases: ['cd'],
        description: 'Think of a clever description',
        usage: 'log --cd',
        run: updateLogger
      },
      {
        name: 'role-create',
        aliases: ['rc'],
        description: 'Think of a clever description',
        usage: 'log --rc',
        run: updateLogger
      },
      {
        name: 'role-update',
        aliases: ['ru'],
        description: 'Think of a clever description',
        usage: 'log --ru',
        run: updateLogger
      },
      {
        name: 'role-delete',
        aliases: ['rd'],
        description: 'Think of a clever description',
        usage: 'log --rd',
        run: updateLogger
      },
      {
        name: 'message-update',
        aliases: ['mu'],
        description: 'Think of a clever description',
        usage: 'log --mu',
        run: updateLogger
      },
      {
        name: 'message-delete',
        aliases: ['md'],
        description: 'Think of a clever description',
        usage: 'log --m',
        run: updateLogger
      },
      {
        name: 'member-update',
        aliases: ['mem'],
        description: 'Think of a clever description',
        usage: 'log --mem',
        run: updateLogger
      }
    ],
    cooldown: {
      amount: 1,
      timer: 1
    }
  },
  run: ctx => {
    console.log('temp')
  }
}
