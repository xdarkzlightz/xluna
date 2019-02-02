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

export const update = {
  config: {
    description: 'Sends the bots update message',
    usage: 'update'
  },
  run (ctx) {
    const embed = {
      color: 43,
      author: {
        name: 'xluna has been updated to 1.4!',
        icon_url: ctx.author.avatarURL
      },
      description:
        'Alright so in this update I got some cool things and major updates to the bot internals',
      fields: [
        {
          name: "What's new?",
          value:
            '- Major updates in the internal structure of xluna\n- Now the bot auto-generates a nsfw rated config when it joins\n- The clear flag no longer removes the database entry\n- The config command lets you change what rating your server is at\n- New help command! It uses reactions!\n- New fun group, introduces 8ball, cute, and say'
        },
        {
          name: 'Bug fixes',
          value: '- Just a lot of fixes and changes under the hood'
        },
        {
          name: 'Notes',
          value:
            "- Because of all the internal changes there's still probably some bugs so if you run into any please tell me\n- The bot auto generated configs for any servers that don't have one already"
        }
      ],
      footer: {
        text: 'Enjoy guys! - Dark'
      }
    }

    ctx.say({ embed })
  }
}
