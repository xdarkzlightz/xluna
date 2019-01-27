import { sendTag, createTag, deleteTag } from '@modules/tags/commands'

export const GroupConfig = {
  name: 'tag',
  description: 'A group that lets you create tags!'
}

export const tag = {
  config: {
    flags: [
      {
        name: 'create',
        aliases: ['c'],
        description: 'Create a new tag',
        usage: 't --create (name) (body)',
        example: "t --create test 'This is a test tag'",
        args: [
          {
            type: 'string',
            name: 'name'
          },
          {
            type: 'string',
            name: 'body'
          }
        ],
        run: createTag
      },
      {
        name: 'delete',
        aliases: ['d'],
        description: 'Deletes a tag',
        usage: 't --delete ',
        example: 't --delete test',
        arg: { type: 'string' },
        run: deleteTag
      }
    ],
    args: [
      {
        type: 'string',
        name: 'name'
      }
    ],
    aliases: ['t'],
    description: 'Send a tag!',
    usage: 'tag (tag)',
    cooldown: {
      amount: 1,
      timer: 1
    }
  },
  run: sendTag
}
