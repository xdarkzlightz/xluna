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
