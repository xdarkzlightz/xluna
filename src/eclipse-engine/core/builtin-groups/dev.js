export const GroupConfig = {
  name: 'dev'
}

export const reload = {
  async run () {}
}

export const test = {
  config: {
    aliases: ['t'],
    rating: 0,
    flags: [
      {
        name: `help`,
        run: async ctx => {
          ctx.say('Ran successfully')
        },
        aliases: ['h']
      }
    ]
  },
  run (ctx) {
    ctx.say('test completed')
  }
}
