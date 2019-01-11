import {
  sendHelp,
  sendInvite,
  sendBotInfo,
  sendMemberInfo,
  sendChannelInfo,
  sendServerInfo,
  sendRoleInfo,
  sendMemberCount
} from '@info/commands'

export const GroupConfig = {
  name: 'info',
  aliases: ['i'],
  description: 'Info group, contains commands that give you info stuff',
  flags: [
    {
      name: 'bot',
      aliases: ['b'],
      description: 'Get info on the bot',
      usage: 'info --b',
      run: sendBotInfo
    },
    {
      name: 'server',
      aliases: ['s'],
      description: 'Get info on the server',
      usage: 'info --s',
      run: sendServerInfo
    },
    {
      name: 'member',
      aliases: ['m', 'whois'],
      description: 'Get info on a member',
      usage: 'info --m',
      arg: { type: 'member' },
      default: ctx => {
        return ctx.member
      },
      run: sendMemberInfo
    },
    {
      name: 'channel',
      aliases: ['c'],
      description: 'Get info on a channel',
      usage: 'info --c',
      arg: { type: 'channel' },
      default: ctx => {
        return ctx.channel
      },
      run: sendChannelInfo
    },
    {
      name: 'role',
      aliases: ['r'],
      description: 'Get info on a role',
      usage: 'info --r',
      arg: { type: 'role' },
      default: ctx => {
        return ctx.guild.defaultRole
      },
      run: sendRoleInfo
    }
  ]
}

export const help = {
  config: {
    aliases: ['h'],
    description: 'This is your magical help command',
    usage: 'help'
  },
  run: sendHelp
}

export const invite = {
  config: {
    description: 'Get a bot invite link & a invite to the bots support server!',
    usage: 'invite'
  },
  run: sendInvite
}

export const membercount = {
  config: {
    aliases: ['c'],
    description: 'Get how many members are currently in your server',
    usage: 'memberCount'
  },
  run: sendMemberCount
}
