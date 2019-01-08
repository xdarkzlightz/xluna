import {
  sendHelp,
  sendInvite,
  sendBotInfo,
  sendMemberInfo,
  sendChannelInfo,
  sendServerInfo,
  sendRoleInfo
} from '@info/commands'

export const GroupConfig = {
  name: 'info',
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

export const botinfo = {
  config: {
    description: 'Get info on the bot!',
    usage: 'botinfo'
  },
  run: sendBotInfo
}

export const serverinfo = {
  config: {
    description: 'Get info on the server',
    usage: 'serverinfo'
  },
  run: sendServerInfo
}

export const memberinfo = {
  config: {
    aliases: ['whois'],
    description:
      "Get info on a member (If you don't specify a member it will target you)",
    usage: 'memberinfo (member)',
    example: 'memberinfo xdarkzlightz'
  },
  run: sendMemberInfo
}

export const channelinfo = {
  config: {
    description:
      "Get info on a channel (If you don't specify a channel it will target the channel you're in",
    usage: 'channelinfo (channel)',
    example: 'channelinfo general'
  },
  run: sendChannelInfo
}

export const roleinfo = {
  config: {
    description:
      "Get info on a role (If you don't specify a role then it will target the everyone role)",
    usage: 'roleinfo (role)',
    example: "roleinfo 'cool people'"
  },
  run: sendRoleInfo
}
