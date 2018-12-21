module.exports.group_config = {
  name: 'guild'
}

// Creates a new command, a config is optional and one will be created
// If a config is not provided then the eclipse engine will create one and then set the name/group properties to the function and group id
// The 'this' keyword gets bound to eclipse-engine/commands/command.js
module.exports.config = {
  config: {
    args: [
      {
        name: 'rating',
        type: 'string',
        values: ['pg', 'pg13', 'nsfw']
      }
    ],
    rating: 0
  },
  async run (ctx, { rating }) {
    const guildExists = await ctx.member.getDB()
    if (guildExists) {
      return ctx.say(
        this.client.util.embed.error({
          type: undefined,
          message: 'Cannot create guild config, one already exists'
        })
      )
    }

    const guildRating = this.client.util.ratings[rating.toUpperCase()]

    await this.client.database.createGuild(ctx.guild, guildRating)

    ctx.say(
      this.client.util.embed.success(
        'Guild config created, you can now run commands!'
      )
    )
  }
}
