const ArgumentParser = require('./commands/argument-parser')
const embed = require('./util/embed-util')
const util = require('./util/util')

const Channel = require('./extensions/channel')
const Member = require('./extensions/member')
const Role = require('./extensions/role')

/**
 * This class controls how messages get handled
 */
class dispatcher {
  constructor (client) {
    this.client = client
    this.registry = client.registry
    this.util = client.util

    // Argument parser handles arguments and command flags
    this.argumentParser = new ArgumentParser(this.client)
  }

  /**
   * This function returns an object containing various helper functions & shortcuts to message properties
   * @param  {discord.js message} message The message you want to target
   * @return {ctx object}         The object containing helper functions and property shortcuts
   */
  createContext (message) {
    return {
      msg: message,
      author: message.author,
      guild: message.guild,
      channel: new Channel(this.client, message.channel),
      member: new Member(this.client, message.member),
      everyone: new Role(
        this.client,
        message.guild.roles.get(message.guild.id)
      ),
      say (msg) {
        message.channel.send(msg)
      }
    }
  }

  /**
   * Handles the discord.js message you pass into it
   * @param  {discord.js message}  message The message you want to target
   * @return {Promise}         The promise wrapper
   */
  async handleMessage (message) {
    const ctx = this.createContext(message)

    let { canRun, cmd, group, args } = this.parseMessage(ctx)
    if (!canRun) return

    const guild = await ctx.everyone.getDB()

    if (!guild && cmd.name !== 'config') {
      return ctx.say(
        embed.error({
          message:
            'You need to create a guild config before running commands! Create one with /config'
        })
      )
    }

    // If there was a found group then parse any command flags else the group variable gets set to the command group
    if (group) {
      return this.argumentParser.parseFlags(group, args, ctx)
    } else {
      group = this.client.registry.groups.get(cmd.group)
    }

    if (
      (group.devOnly || cmd.devOnl) &&
      this.client.devs.indexOf(ctx.author.id) >= 0
    ) {
      return
    }

    if (cmd.name !== 'config') {
      // Parses any command flags, if a command flag was found it runs it and then returns
      const parsedFlags = await this.argumentParser.parseFlags(cmd, args, ctx)
      if (parsedFlags) return

      let enabled = cmd.enabled('member', ctx.author, guild)

      if (enabled === undefined) {
        const roles = guild.roles
        let roleEnabled

        roles.forEach(roleDB => {
          const memberRole = ctx.msg.member.roles.get(roleDB.id)
          if (!memberRole) return

          const foundRole = util.findID(roles, memberRole.id)
          const group = util.findName(foundRole.groups, cmd.group)
          const command = util.findName(group.commands, cmd.name)
          roleEnabled = command.enabled
        })
        enabled = roleEnabled
      }

      const channelEnabled = cmd.enabled('channel', ctx.channel, guild)

      if (enabled && channelEnabled === false) {
        return ctx.say(
          embed.error({ message: 'Command disabled in this channel!' })
        )
      }

      if (enabled === false) {
        return ctx.say(embed.error({ message: 'Command disabled!' }))
      }
    }

    // Parses any arguments, if there's an error then say the error and return
    const parsedArgs = await this.argumentParser.parseArgs(cmd, args, ctx)
    if (parsedArgs.error) return ctx.say(embed.error(parsedArgs.error))

    cmd.run(ctx, parsedArgs.values)
  }

  /**
   * Parses the message from the ctx object and get a command or group
   * @param  {ctx object} ctx An object contaning helper functions and proprety shortcuts
   * @return {response object}     An object contaning if the command can run
   */
  parseMessage (ctx) {
    const response = { canRun: true }
    const prefix = this.client.getPrefix()
    const content = ctx.msg.content

    if (ctx.author.bot) response.canRun = false
    if (!content.startsWith(prefix)) response.canRun = false
    if (content.startsWith(prefix + ' ')) response.canRun = false
    if (!response.canRun) return response

    response.args = content
      .slice(prefix.length)
      .trim()
      .split(/ +/g)

    const name = response.args.shift().toLowerCase()
    response.cmd = this.client.registry.commands.get(name)

    // Get the group from the name constant
    response.group = this.client.registry.groups.get(name)
    if (!response.group && !response.cmd) response.canRun = false

    return response
  }
}

module.exports = dispatcher
