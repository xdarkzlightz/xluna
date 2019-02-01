import {
  sendHelp,
  sendInvite,
  sendBotInfo,
  sendMemberInfo,
  sendChannelInfo,
  sendServerInfo,
  sendRoleInfo,
  sendMemberCount
} from '@modules/info/commands'

export const GroupConfig = {
  name: 'info',
  aliases: ['i'],
  description: 'Info group, contains commands that give you info stuff'
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
    description: 'Get how many members are currently in your server',
    usage: 'memberCount'
  },
  run: sendMemberCount
}

export const serverinfo = {
  config: { description: 'Get info on the server!', usage: 'serverinfo' },
  run: sendServerInfo
}

export const botinfo = {
  config: { description: 'Get info on the bot', usage: 'botinfo' },
  run: sendBotInfo
}

export const memberinfo = {
  config: {
    aliases: ['whois'],
    description: 'Get info on a member',
    usage: 'memberinfo',
    example: 'memberinfo xdarkzlightz#6969',
    args: [{ type: 'member', default: ctx => ctx.member }]
  },
  run: sendMemberInfo
}

export const roleinfo = {
  config: {
    name: 'role',
    aliases: ['ir'],
    description: 'Get info on a role',
    usage: 'roleinfo (role)',
    example: "roleinfo 'test role'",
    args: [{ type: 'role', default: ctx => ctx.guild.defaultRole }]
  },
  run: sendRoleInfo
}

export const channelinfo = {
  name: 'channel',
  aliases: ['ic'],
  description: 'Get info on a channel',
  usage: 'channelinfo (channel)',
  example: 'channelinfo general',
  arg: { type: 'channel', default: ctx => ctx.channel },
  run: sendChannelInfo
}
