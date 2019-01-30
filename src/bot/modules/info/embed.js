export async function createPageOne (ctx, embed) {
  const prefix = ctx.guild.db.data.config.prefix
  const app = await ctx.client.fetchApplication()
  embed.setAuthor(`Bot Help`, app.iconURL)
  let extended = ''
  if (ctx.member.hasPermission('ADMINISTRATOR')) {
    extended =
      `__**Here's the basics on how to configure your server**__\n` +
      `How to set a prefix: ${prefix}config --set-prefix (prefix)\n` +
      `How to change the default server rating: ${prefix}config (rating)\n` +
      "**__Here's some things you should know about the bot!__**\n" +
      "Default rating: All servers by default will have a rating of nsfw, if you'd like to change this rating you'll need to use the command specified above\n" +
      'What the default rating does is disable/enable commands by default using the rating\n' +
      "The default rating also makes it so if any commands get added to the bot, if they're not fit for your rating they'll get auto-disabled\n" +
      "In order to use spaces in lets say a reason for a ban, you'd have to use singe quotes. Example: 'User was spamming'\n" +
      `__**How to configure your server**__\n` +
      'Member group configs will override roles, if a member has a command enabled/disbaled it will override any role configs\n' +
      `Example: ${prefix}u --disable-member ${app.owner.tag}\n` +
      'You can have per-role command configs, one is automatically generated aka the everyone role, you can not remove this config but you can configure it\n' +
      `Example: ${prefix}u --disable-role, this would disable the uno group for everyone, ${prefix}u --disable-role 'cool role' would disable the uno group for 'cool role'\n` +
      'Channel configs, these determine what commands should actually be ran in a channel by anyone\n' +
      `Example: ${prefix}u --disable-channel, this would disable the uno group for the channel the command was ran in, you can also do ${prefix}u --disable-channel general to disable a different channel\n` +
      `You can clear group configs if you'd like to remove any restrictions on a Role, member, or channel\n` +
      `Example: ${prefix}config --clear-member ${app.owner.tag}`
  }
  embed.setDescription(
    `Hello! I am a bot created by ${
      app.owner.tag
    } and  I have a lot of fun features you can use!\n` + extended
  )

  let groups = []
  ctx.client.registry.groups.forEach(group => {
    if (group.devOnly) return
    const groupOBJ = {}
    let groupAliases = ''
    if (group.aliases) groupAliases = `(${group.aliases.join(', ')})`
    groupOBJ.name = `**${group.name} ${groupAliases}** - ${group.description}`
    groups.push(groupOBJ)
  })

  if (groups.length) {
    embed.addField('Groups', groups.map(g => `${g.name}\n`).join(''))
  } else embed.addField('Groups', 'Looks like you have nothing enabled 😢')

  embed.setFooter(
    `React with ◀ and ▶ to see groups or do ${prefix}group --h or ${prefix}command --h to get more info`,
    app.owner.avatarURL
  )
}

export async function createHelpMessage (ctx, embed) {
  const app = await ctx.client.fetchApplication()
  embed.setAuthor(`Bot Help`, app.iconURL)
  embed.setDescription(
    `Hello! I am a bot created by ${
      app.owner.tag
    }.Currently my only feature is uno but I'll have more soonTM\n` +
      'Server config: I offer different commands and command flags that allow you to configure your server!\n' +
      `${
        ctx.prefix
      }config (rating) lets you setup a config for the server, ratings: pg, pg13, nsfw.\n` +
      `${
        ctx.prefix
      }config --prefix (prefix) lets you set a prefix for the server\n` +
      'Command flags: Command flags start with a -- and let you do actions\n' +
      '--enable-role lets you enable a command for a role, doing --disable-role lets you disable a command for a role\n' +
      'Flags that are enabled on all commands: --enable-role, --disable-role, --enable-member, --disable-member, --enable-channel, --disable-channel\n' +
      'Note: If you need to use spaces you have to put the argument in single quotes\n' +
      `Example: ${ctx.prefix}config --clear-channel 'Test Channel'`
  )
  let groups = []
  ctx.client.registry.groups.forEach(group => {
    if (group.devOnly) return
    const groupOBJ = {}

    let commands = ''
    group.commands.forEach(cmd => {
      let enabled = ctx.db.commandEnabledForMember(ctx)
      if (!enabled) return

      let aliases = ''
      if (cmd.aliases) {
        aliases = `(${cmd.aliases.join(', ')})`
      }
      commands += `  ${cmd.name} ${aliases} - *${cmd.description}*\n`
    })
    if (commands === '') return
    let groupAliases = ''
    if (group.aliases) groupAliases = `(${group.aliases.join(', ')})`
    groupOBJ.name = `${group.name} ${groupAliases} - ${group.description}`
    groupOBJ.commands = commands
    groups.push(groupOBJ)
  })

  groups.forEach(group => {
    embed.addField(group.name, group.commands)
  })

  embed.setFooter(
    `Created by: ${app.owner.tag} | Do ${ctx.prefix}group --h or ${
      ctx.prefix
    }command --h to get more info`,
    app.owner.avatarURL
  )
}
