import { setPrefix, addGuild, clear } from '@eclipse/database'
import { ratings } from '@eclipse/util/database'

export const GroupConfig = {
  name: 'guild'
}

export const config = {
  config: {
    rating: 0,
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
        run: async (ctx, arg) => {
          if (!ctx.db) {
            return ctx.error(
              `You need to create a server config before running this flag!`
            )
          }

          setPrefix(arg, ctx.db)
          await ctx.db.save()

          ctx.success(`Prefix set to ${arg}`)
        },
        arg: { name: 'prefix', type: 'string' }
      },
      {
        name: `clear-channel`,
        run: clear,
        arg: { type: 'channel' },
        default: ctx => {
          return ctx.channel
        }
      },
      {
        name: `clear-member`,
        run: clear,
        arg: { type: 'member' }
      },
      {
        name: `clear-role`,
        run: clear,
        arg: { type: 'role' },
        default: ctx => {
          return ctx.guild.roles.get(ctx.guild.id)
        }
      }
    ]
  },
  async run (ctx, { rating }) {
    const guildExists = ctx.db
    if (guildExists) {
      return ctx.error('Cannot create server config, one already exists')
    }

    await addGuild(ctx, ratings[rating.toUpperCase()])

    ctx.success('Server config created, you can now run commands!')
  }
}
