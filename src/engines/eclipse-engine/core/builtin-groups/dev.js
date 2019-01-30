export const GroupConfig = {
  name: 'dev',
  devOnly: true,
  beforeEach (ctx) {
    return ctx.author.username
  },
  description:
    'Developer group, all developer commands essential to the bot goes here'
}

export const test = {
  config: {
    aliases: ['t'],
    clientPermissions: ['ADMINISTRATOR'],
    memberPermissions: ['ADMINISTRATOR'],
    rating: 0,
    flags: [
      {
        name: 'test',
        run: async ctx => {
          ctx.say('Ran successfully')
        },
        description: 'This is just flag',
        usage: 'test --test'
      }
    ],
    args: [
      {
        name: 'testArg',
        type: 'string',
        options: ['test'],
        description: 'Just a test argument'
      }
    ],
    description: 'This is just a test command',
    usage: 'test'
  },
  run (ctx, { testArg }) {
    ctx.say(testArg)
  }
}

export const reloadcache = {
  config: {
    aliases: ['rc'],
    description: 'Reloads the guild cache',
    usage: 'reloadcache'
  },
  async run (ctx) {
    ctx.db.guilds.clear()
    await ctx.db.cache()
    ctx.success('Cache reloaded!')
  }
}

export const evaluate = {
  config: {
    aliases: ['rc'],
    description: 'Reloads the guild cache',
    usage: 'reloadcache',
    args: [
      {
        type: 'string',
        name: 'code'
      }
    ]
  },
  async run (ctx, { code }) {
    try {
      // eslint-disable-next-line
      const evaled = await eval(code)
      if (typeof evaled === 'string') ctx.say(evaled)
    } catch (e) {
      ctx.error(`Error: ${e.message}`)
    }
  }
}
