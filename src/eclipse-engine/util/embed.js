import { RichEmbed } from 'discord.js'

// Select colours that get used often
const colours = {
  success: 0x57e69,
  error: 0xdb435d
}

// Images that get used often
const images = {
  checkmark:
    'https://image.ibb.co/ioKmvz/kisspng-check-mark-tick-clip-art-tick-5aac0430469033-9237016715212227042891.png',
  x:
    'https://image.ibb.co/bvNgAz/kisspng-computer-icons-free-content-clip-art-red-x-png-5ab1910a3f3a03-969308161521586442259.png'
}

// Export colours and images
const _colours = colours
export { _colours as colours }
const _images = images
export { _images as images }

/**
 * Embeds an success message
 * @param  {String} message The message you want to embed
 * @return {discord.js embed}         Embedded message
 */
export function success (message) {
  const embed = new RichEmbed()
    .setAuthor(message, images.checkmark)
    .setColor(colours.success)
  return embed
}

/**
 * Embeds an error message
 * @param  {String}           type     The type of message you want to embed
 * @param  {String}           message  The message you want to embed
 * @param  {Array}            values   An array of values that are used as options
 * @return {discord.js Embeds}         Discord.js embed object
 */
export function error (msg, settings = {}) {
  const embed = new RichEmbed().setAuthor(msg, images.x).setColor(colours.error)

  if (settings.defaults) {
    embed.addField('Valid options', settings.defaults.join(' '))
  }

  return embed
}

export function generateCommandHelp (ctx, embed) {
  const cmd = ctx.cmd
  let aliases = ''
  if (cmd.aliases) {
    aliases = `(${cmd.aliases.join(', ')})`
  }
  embed.setAuthor(`${cmd.name} ${aliases}`)
  embed.setDescription(
    `Group: *${cmd.group.name}*\nDescription: *${cmd.description}*\nUsage: *${
      ctx.prefix
    }${cmd.usage}*\nExample: *${ctx.prefix}${
      cmd.example ? cmd.example : cmd.usage
    }*`
  )

  if (cmd.args) {
    let args = ''
    cmd.args.forEach(arg => {
      let options = '\n\n'
      if (arg.options) {
        options = `\nOptions: *${arg.options.join(', --')}*`
      }
      args += `${arg.name}\nType: *${arg.type}*\nDescription: *${
        arg.description
      }*${options}`
    })
    embed.addField('Arguments', args)
  }

  if (cmd.command.config.flags) {
    let flags = ''
    cmd.command.config.flags.forEach(flag => {
      if (flag.devonly) return
      let flagAliases = ''
      if (flag.aliases) {
        flagAliases = `(--${flag.aliases.join(', --')})`
      }
      flags += `--${flag.name} ${flagAliases}\nDescription: *${
        flag.description
      }*\nUsage: *${ctx.prefix}${flag.usage}*\nExample: *${ctx.prefix}${
        flag.example ? flag.example : flag.usage
      }*\n\n`
    })
    embed.addField('flags', flags)
  }
}

export function generateGroupHelp (ctx, embed) {
  const group = ctx.group

  embed.setAuthor(`${group.name}`)
  embed.setDescription(`\nDescription: *${group.description}*\n`)

  let commands = ''
  group.commands.forEach(cmd => {
    let aliases = ''
    if (cmd.aliases) {
      aliases = `(${cmd.aliases.join(', ')})`
    }
    commands += `${cmd.name} ${aliases}\nDescription: ${cmd.description}\n\n`
  })
  embed.addField('commands', commands)
}

export async function createJoinEmbed (client, embed) {
  const app = await client.fetchApplication()

  embed.setAuthor('Thanks for inviting me!', client.user.avatarURL)
  embed.setDescription(
    `I'm a multi-purpose discord bot created by ${
      app.owner.tag
    } that can currently only play uno in the ` +
      `future I'll have more commands though!\nTo get started please create a server config with ${
        client.prefix
      }config, from there you can set a custom prefix with ${
        client.prefix
      }config --set-prefix (prefix)\n` +
      `If you need additional help run the help command ${client.prefix}help`
  )

  embed.addField(
    'Invites',
    `[Support Server](${client.supportServer})\n[Bot Invite](${
      client.botInvite
    })`
  )
}
