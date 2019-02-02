import { askQuestion, sayMessage, isCute } from '@modules/fun/commands'

export const GroupConfig = {
  name: 'fun',
  description: 'Random fun commands'
}

export const cute = {
  config: {
    description: "There's a chance you're cute. But you probably aren't",
    usage: 'cute (member)',
    args: [{ type: 'member', default: ctx => ctx.member }]
  },
  run: isCute
}

export const ask = {
  config: {
    aliases: ['8ball'],
    description: 'Ask the bot a random question!',
    usage: 'ask "Am I cool?"',
    args: [{ type: 'string', name: 'question' }]
  },
  run: askQuestion
}

export const say = {
  config: {
    description: 'Have the bot repeat something you said!',
    usage: 'say oof',
    args: [{ type: 'string', name: 'message' }]
  },
  run: sayMessage
}
