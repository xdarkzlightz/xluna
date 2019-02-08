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
        name: 'xluna has been updated to 1.5!',
        icon_url: ctx.author.avatarURL
      },
      description:
        'So I got a couple cool things added in this update and some improvements',
      fields: [
        {
          name: "What's new?",
          value: `- Minor improvements to xluna's internals\n- You no longer have to use single quotes for spaces *In most cases*\n- New self role feature (adds a group) You can have selfroles and reaction roles!\n- New purge command\n- Server statistics\n- Adjusted exp gain, you now get 10-50 exp per minute per message\n- The online field in membercount now includes idle & dnd members\n- The bot will yell at you if you try nicknaming someone it can't nickname`
        },
        {
          name: 'Bug fixes',
          value: '- Fixed a bug with the help flag\n- Fixed bugs on my end'
        },
        {
          name: 'Notes',
          value:
            '- The purge command has a --m flag if you want to purge a specific users messages\n- Wanna buy me coffee?'
        }
      ],
      footer: {
        text: 'Enjoy guys! - Dark'
      }
    }

    ctx.say({ embed })
  }
}
