import {
  setLoggingChannel,
  updateLogger,
  updateLeaveChannel,
  updateWelcomeChannel,
  updateLeaveMessage,
  updateWelcomeMessage,
  updateJoinRole,
  removeWelcome,
  removeLeave,
  removeAutorole,
  removeLogger
} from '@modules/serverutil/commands'

export const GroupConfig = {
  name: 'serverutil',
  description: 'Commands that provide utilities for your server'
}

export const log = {
  config: {
    description: 'A command for logging',
    usage: 'log',
    memberPermissions: ['ADMINISTRATOR'],
    args: [
      {
        type: 'channel',
        name: 'channel',
        description: 'The channel you want to log in'
      }
    ],
    flags: [
      {
        name: 'channel-create',
        aliases: ['cc'],
        description: 'enable logging for channel creation',
        usage: 'log --cc',
        run: updateLogger
      },
      {
        name: 'channel-update',
        aliases: ['cu'],
        description: 'enable logging for channel updates',
        usage: 'log --cu',
        run: updateLogger
      },
      {
        name: 'channel-delete',
        aliases: ['cd'],
        description: 'enable logging for channel deletion',
        usage: 'log --cd',
        run: updateLogger
      },
      {
        name: 'role-create',
        aliases: ['rc'],
        description: 'enable logging for role creation',
        usage: 'log --rc',
        run: updateLogger
      },
      {
        name: 'role-update',
        aliases: ['ru'],
        description: 'enable logging for role updates',
        usage: 'log --ru',
        run: updateLogger
      },
      {
        name: 'role-delete',
        aliases: ['rd'],
        description: 'enable logging for role deletions',
        usage: 'log --rd',
        run: updateLogger
      },
      {
        name: 'message-update',
        aliases: ['mu'],
        description: 'enable logging for message updates',
        usage: 'log --mu',
        run: updateLogger
      },
      {
        name: 'message-delete',
        aliases: ['md'],
        description: 'enable logging for message deletions',
        usage: 'log --m',
        run: updateLogger
      },
      {
        name: 'member-update',
        aliases: ['mem'],
        description: 'enable logging for member deletions',
        usage: 'log --mem',
        run: updateLogger
      },
      {
        name: 'remove',
        aliases: ['r'],
        description: 'Remove the logging channel',
        usage: 'log --r',
        run: removeLogger
      }
    ],
    cooldown: {
      amount: 1,
      timer: 1
    }
  },
  run: setLoggingChannel
}

export const welcome = {
  config: {
    description: 'A command for welcoming members',
    usage: 'welcome',
    memberPermissions: ['ADMINISTRATOR'],
    args: [
      {
        type: 'channel',
        name: 'channel',
        description: 'The channel you want to welcome people in'
      }
    ],
    flags: [
      {
        name: 'remove',
        aliases: ['r'],
        description: 'Remove the welcome message',
        usage: 'welcome --r',
        run: removeWelcome
      },
      {
        name: 'set-message',
        aliases: ['sm'],
        description: 'Set the welcome message',
        usage: 'leave --sm',
        arg: { type: 'string' },
        run: updateWelcomeMessage
      }
    ]
  },
  run: updateWelcomeChannel
}

export const leave = {
  config: {
    description: 'A command for leaving members',
    usage: 'leave',
    memberPermissions: ['ADMINISTRATOR'],
    args: [
      {
        type: 'channel',
        name: 'channel',
        description: 'The channel you want to send leave messages in'
      }
    ],
    flags: [
      {
        name: 'remove',
        aliases: ['r'],
        description: 'Remove the leave message',
        usage: 'leave --r',
        run: removeLeave
      },
      {
        name: 'set-message',
        aliases: ['sm'],
        description: 'Set the leave message',
        usage: 'leave --sm',
        arg: { type: 'string' },
        run: updateLeaveMessage
      }
    ]
  },
  run: updateLeaveChannel
}

export const autorole = {
  config: {
    description: 'A command for leaving members',
    usage: 'leave',
    memberPermissions: ['ADMINISTRATOR'],
    args: [
      {
        type: 'role',
        name: 'role',
        description: 'The role you want to give to people when they join'
      }
    ],
    flags: [
      {
        name: 'remove',
        aliases: ['r'],
        description: 'Remove the auto-role',
        usage: 'autorole --r',
        run: removeAutorole
      }
    ]
  },
  run: updateJoinRole
}
