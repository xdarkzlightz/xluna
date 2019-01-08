import { sendHelp, sendInvite } from '@eclipse/info/commands'

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
