export const GroupConfig = {
  name: 'dev'
}

export const load = {
  config: {
    args: [
      {
        type: 'string',
        name: 'file'
      }
    ],
    rating: 0
  },
  async run (ctx, { file }) {}
}

export const reload = {
  async run () {}
}

export const test = {
  config: {
    aliases: ['t'],
    rating: 0
  },
  run (ctx) {
    ctx.say('test completed')
  }
}
