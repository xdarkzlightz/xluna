import { clear } from '@engines/eclipse/core'

export const GroupConfig = {
  name: 'guild',
  description: 'Contains useful server configuration commands'
}

export const config = {
  config: {
    memberPermissions: ['ADMINISTRATOR'],
    args: [
      {
        name: 'rating',
        type: 'string',
        options: ['pg', 'pg13', 'nsfw']
      }
    ],
    flags: [
      {
        name: `set-prefix`,
        aliases: ['prefix'],
        description: 'Sets the server prefix',
        usage: 'config --set-prefix (prefix)',
        example: 'config --set-prefix /',
        run: async (ctx, { prefix }) => {
          ctx.guild.db.data.config.prefix = prefix.replace(/\s+/g, '')
          ctx.success(`Prefix set to ${prefix.replace(/\s+/g, '')}`)
        },
        args: [{ name: 'prefix', type: 'string' }]
      },
      {
        name: `clear-channel`,
        description: 'Lets you clear the config for a channel',
        usage: 'config --clear-channel (channel)',
        example: 'config --clear-channel general',
        run: clear,
        args: [{ type: 'channel', name: 'arg', default: ctx => ctx.channel }]
      },
      {
        name: `clear-member`,
        description: 'Lets you clear the config for a member',
        usage: 'config --clear-member (member)',
        example: 'config --clear-member xdarkzlightz',
        run: clear,
        args: [{ type: 'member', name: 'arg' }]
      },
      {
        name: `clear-role`,
        description: 'Lets you clear the config for a role',
        usage: 'config --clear-role (role)',
        example: 'config --clear-role role',
        run: clear,
        args: [
          {
            type: 'role',
            name: 'arg',
            default: ctx => ctx.guild.roles.get(ctx.guild.id)
          }
        ]
      }
    ],
    description: 'Lets you create a server config',
    usage: 'config (rating)',
    example: 'config pg'
  },
  async run (ctx, { rating }) {
    const db = ctx.guild.db

    const ratings = {
      PG: 0,
      PG13: 1,
      NSFW: 2
    }

    db.data.config.rating = ratings[rating.toUpperCase()]

    const role = db.roles.get(ctx.guild.id)
    role.data.groups = ctx.db.createGroups(db.data.config.rating)
    role.reload()

    ctx.success(`Server rating changed to ${rating}`)
  }
}
