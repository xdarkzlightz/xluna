import {
  banMember,
  softbanMember,
  kickMember,
  warnMember,
  getWarnings,
  deleteWarning,
  clearWarnings,
  sendLogs,
  addNick,
  deleteNick,
  deleteMod,
  addMod
} from '@modules/moderation/commands'

export const GroupConfig = {
  name: 'moderation',
  description: 'Commands to help you moderate your server'
}

export const ban = {
  config: {
    description: 'Ban a member from your server',
    usage: 'ban (member) (reason)',
    example: "ban xdarkzlightz 'get yeeted'",
    clientPermissions: ['BAN_MEMBERS'],
    memberPermissions: ['BAN_MEMBERS'],
    args: [
      {
        type: 'member',
        name: 'member'
      },
      {
        type: 'string',
        name: 'reason'
      }
    ]
  },
  run: banMember
}
export const softban = {
  config: {
    description: 'Removes messages from a member by banning and unbanning them',
    usage: 'softban (member) (reason)',
    example: "softban xdarkzlightz 7d 'get yeeted fam'",
    clientPermissions: ['BAN_MEMBERS'],
    memberPermissions: ['BAN_MEMBERS'],
    args: [
      {
        type: 'member',
        name: 'member'
      },
      {
        type: 'number',
        name: 'days'
      },
      {
        type: 'string',
        name: 'reason'
      }
    ]
  },
  run: softbanMember
}

export const kick = {
  config: {
    description: 'kick a member from your server',
    usage: 'kick (member) (reason)',
    example: 'kick xdarkzlightz ya bad',
    clientPermissions: ['KICK_MEMBERS'],
    memberPermissions: ['KICK_MEMBERS'],
    args: [
      {
        type: 'member',
        name: 'member'
      },
      {
        type: 'string',
        name: 'reason'
      }
    ]
  },
  run: kickMember
}

export const warn = {
  config: {
    description: 'Warn a member in your server',
    usage: 'warn (member) (reason)',
    example: 'warn xdarkzlightz posting bad memes',
    args: [
      {
        type: 'member',
        name: 'member'
      },
      {
        type: 'string',
        name: 'reason'
      }
    ],
    cooldown: {
      amount: 2,
      timer: 1
    },
    flags: [
      {
        name: 'remove',
        aliases: ['r'],
        description: 'Get a remove a warning from a member using the warning #',
        usage: 'warn --r',
        args: [{ type: 'member' }, { type: 'number' }],
        run: deleteWarning
      },
      {
        name: 'clear',
        aliases: ['c'],
        description: 'Clear a members warnings',
        usage: 'warn --c',
        args: [{ type: 'member' }],
        run: clearWarnings
      }
    ]
  },
  run: warnMember
}

export const warnings = {
  config: {
    description: 'Get a list of warnings for a user',
    usage: 'warnings (member)',
    args: [{ type: 'member' }]
  },
  run: getWarnings
}

export const logs = {
  config: {
    description: 'Get the moderation logs for a member',
    usage: 'logs (member)',
    example: 'logs xdarkzlightz',
    args: [
      {
        type: 'member',
        name: 'member'
      }
    ],
    cooldown: {
      amount: 2,
      timer: 1
    }
  },
  run: sendLogs
}

export const nick = {
  config: {
    description:
      'Lets you nickname a member, if they were to leave the server and join back this nickname will be applied to them',
    usage: 'nick (member) (nickname)',
    example: 'nick xdarkzlightz nerd',
    clientPermissions: ['MANAGE_NICKNAMES'],
    memberPermissions: ['MANAGE_NICKNAMES'],
    args: [
      {
        type: 'member',
        name: 'member'
      },
      {
        type: 'string',
        name: 'nickname'
      }
    ],
    flags: [
      {
        name: 'remove',
        aliases: ['r'],
        description: 'Remove a members nickname',
        usage: 'nick --r',
        args: [{ type: 'member' }],
        run: deleteNick
      }
    ]
  },
  run: addNick
}

export const mod = {
  config: {
    description: 'Lets you add a mod role',
    usage: 'mod (role)',
    example: 'mod moderators',
    memberPermissions: ['ADMINISTRATOR'],
    args: [
      {
        type: 'role',
        name: 'role'
      }
    ],
    flags: [
      {
        name: 'remove',
        aliases: ['r'],
        description: 'Remove a mod role',
        usage: ' --r',
        args: [{ type: 'role' }],
        run: deleteMod
      }
    ]
  },
  run: addMod
}
