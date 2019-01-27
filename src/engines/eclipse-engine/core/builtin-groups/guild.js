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
        values: ['pg', 'pg13', 'nsfw']
      }
    ],
    flags: [
      {
        name: `set-prefix`,
        aliases: ['prefix'],
        description: 'Sets the server prefix',
        usage: 'config --set-prefix (prefix)',
        example: 'config --set-prefix /',
        run: async (ctx, arg) => {
          if (!ctx.db) {
            return ctx.error(
              `You need to create a server config before running this flag!`
            )
          }

          await ctx.db.setPrefix(ctx.guild.db, arg)

          ctx.success(`Prefix set to ${arg.replace(/\s+/g, '')}`)
        },
        arg: { name: 'prefix', type: 'string' }
      },
      {
        name: `clear-channel`,
        description: 'Lets you clear the config for a channel',
        usage: 'config --clear-channel (channel)',
        example: 'config --clear-channel general',
        run: clear,
        memberPermissions: ['ADMINISTRATOR'],
        arg: { type: 'channel' },
        default: ctx => {
          return ctx.channel
        }
      },
      {
        name: `clear-member`,
        description: 'Lets you clear the config for a member',
        usage: 'config --clear-member (member)',
        example: 'config --clear-member xdarkzlightz',
        run: clear,
        arg: { type: 'member' }
      },
      {
        name: `clear-role`,
        description: 'Lets you clear the config for a role',
        usage: 'config --clear-role (role)',
        example: 'config --clear-role role',
        run: clear,
        arg: { type: 'role' },
        default: ctx => {
          return ctx.guild.roles.get(ctx.guild.id)
        }
      }
    ],
    description: 'Lets you create a server config',
    usage: 'config (rating)',
    example: 'config pg'
  },
  async run (ctx, { rating }) {
    const guildExists = ctx.guild.db
    if (guildExists) {
      return ctx.error('Cannot create server config, one already exists')
    }

    const ratings = {
      PG: 0,
      PG13: 1,
      NSFW: 2
    }

    await ctx.db.newGuild(ctx, ratings[rating.toUpperCase()])

    ctx.success('Server config created, you can now run commands!')
  }
}
