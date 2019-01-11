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
      let aliases = ''
      if (cmd.aliases) {
        aliases = `(${cmd.aliases.join(', ')})`
      }
      commands += `  ${cmd.name} ${aliases} - *${cmd.description}*\n`
    })
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
