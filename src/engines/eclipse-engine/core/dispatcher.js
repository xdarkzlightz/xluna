import { Collection } from 'discord.js'

import { ArgumentParser, CTX } from '@engines/eclipse/core'
import {
  checkForClientPerms,
  checkForMemberPerms
} from '@engines/eclipse/util/other'

/**
 * This class controls how messages get handled
 */
class dispatcher {
  constructor (client) {
    this.client = client

    this.devs = client.devs

    this.registry = client.registry
    this.logger = client.logger

    // Argument parser handles arguments and command flags
    this.argumentParser = new ArgumentParser(client)

    this.userCooldowns = new Collection()
    this.levelCooldowns = new Collection()
  }

  /**
   * Parses the message from the ctx object and get a command or group
   * @param  {ctx object} ctx An object contaning helper functions and proprety shortcuts
   * @return {response object}     An object contaning if the command can run
   */
  parseMessage (ctx) {
    this.logger.debug(`[Dispatcher]: Parsing message ${ctx.msg.id}`)
    const response = { canRun: true }
    const prefix = ctx.prefix
    const content = ctx.msg.content
    const mentionsBot = ctx.msg.mentions.members.get(ctx.client.user.id)
    if (mentionsBot) {
      response.mentionsBot = true
      response.canRun = true
    }

    if (ctx.msg.channel.type === 'dm') response.canRun = false
    if (!content.startsWith(prefix)) response.canRun = false
    if (content.startsWith(prefix + ' ')) {
      response.canRun = false
    }
    if (!response.canRun) return response

    response.args = content
      .slice(prefix.length)
      .trim()
      .split(/ +/g)

    const name = response.args.shift().toLowerCase()
    response.cmd = this.registry.commands.get(name)
    if (!response.cmd) response.cmd = this.registry.aliases.get(name)

    // Get the group from the name constant
    response.group = this.registry.groups.get(name)
    if (!response.group) response.group = this.registry.groupAliases.get(name)

    if (!response.cmd && response.group) {
      response.cmd = response.group.commands.get(response.args[0])
      if (!response.cmd) {
        response.cmd = response.group.commandAliases.get(response.args[0])
      }
      if (response.cmd) response.args.shift()
    }

    if (!response.group && !response.cmd & !mentionsBot) response.canRun = false
    return response
  }

  // Runs before the command gets handled, sets up variables & CTX
  // Emits an pre-command event to the client so you can do things before the command runs
  // Using CTX
  async preCommand (ctx) {
    await ctx.init()
    const cmdMsg = this.parseMessage(ctx)
    ctx.cmd = cmdMsg.cmd
    if (cmdMsg.group) {
      ctx.group = cmdMsg.group
    } else if (ctx.cmd) {
      ctx.group = cmdMsg.cmd.group
    }

    this.client.emit('preCommand', ctx)

    return cmdMsg
  }

  handleCooldown ({ cmd, author, error }) {
    if (!cmd || !cmd.cooldown) return true
    let strikes = cmd.strikes.get(author.id)
    if (cmd.userCooldowns.has(author.id)) {
      if (cmd.messageCooldowns.has(author.id)) {
        return false
      } else {
        cmd.messageCooldowns.set(author.id, author)
        setTimeout(() => {
          cmd.messageCooldowns.delete(author.id)
        }, 1000)
        error(`This command is on cooldown!`)
      }
      return false
    } else if (strikes >= cmd.cooldown.amount) {
      cmd.userCooldowns.set(author.id, author)
      setTimeout(() => {
        cmd.userCooldowns.delete(author.id)
        cmd.strikes.delete(author.id)
      }, cmd.cooldown.timer * 1000)
      cmd.messageCooldowns.set(author.id, author)
      setTimeout(() => {
        cmd.messageCooldowns.delete(author.id)
      }, 1000)
      error('This command is on cooldown!')
      return false
    } else {
      if (!strikes) {
        cmd.strikes.set(author.id, 0)
        strikes = cmd.strikes.get(author.id)
      }
      cmd.strikes.set(author.id, strikes + 1)
      setTimeout(() => cmd.strikes.delete(author.id), cmd.cooldown.timer * 1000)
      return true
    }
  }

  // Runs after a command is found or group is found
  // This determines if the command should actually run
  // Emits a command event so you can modify CTX at this state
  // And check to see if the command should actually run
  async handleCommand (ctx) {
    const { cmd, group } = ctx
    if (!cmd) return true

    if (
      (group.devOnly || cmd.devOnly) &&
      this.devs.indexOf(ctx.author.id) === -1
    ) {
      return
    }

    const noCooldown = this.handleCooldown(ctx)
    if (!noCooldown) return false

    // We will never need this function outside of eclipse so we just put it here
    const handleDB = () => {
      if (cmd && (cmd.devOnly || cmd.group.devOnly)) return true

      let enabled = ctx.db.commandEnabledForMember(ctx)

      const channelEnabled = ctx.db.commandEnabledInChannel(
        ctx,
        ctx.guild.db.channels
      )

      if (enabled && channelEnabled === false) {
        ctx.error('Command disabled in this channel!')
      } else if (enabled === false) {
        ctx.error('Command disabled!')
      } else {
        return true
      }
    }

    // If the command/group was disabled return, if there is no DB handleDB() will return true
    if (!ctx.member.hasPermission('ADMINISTRATOR') && !handleDB(cmd, ctx)) {
      return false
    }

    if (cmd.nsfw && !ctx.channel.nsfw) {
      ctx.error('Cannot run nsfw commands in non nsfw channels')
      return false
    }

    this.client.emit('command', ctx)
    return true
  }

  postCommand (ctx) {
    if (ctx.guild && ctx.guild.db) {
      ctx.guild.db.save()
    }
    this.client.emit('command', ctx)
  }

  /**
   * Handles the discord.js message you pass into it
   * @param  {discord.js message}  message The message you want to target
   * @return {Promise}         The promise wrapper
   */
  async handleMessage (message) {
    const ctx = new CTX(message, this.client)
    try {
      if (ctx.msg.author.bot) return

      let { canRun, mentionsBot, cmd, group, args } = await this.preCommand(ctx)
      this.logger.debug(`[Dispatcher]: Command: ${cmd ? cmd.name : false}`)
      this.logger.debug(
        `[Dispatcher: Group ${ctx.group ? ctx.group.name : false}`
      )
      this.logger.debug(
        `[Dispatcher]: User is an admin? ${ctx.member.hasPermission(
          'ADMINISTRATOR'
        )}`
      )
      if (!canRun && !mentionsBot) return false
      if (mentionsBot) {
        return ctx.success(`Current bot prefix is: ${ctx.prefix}`)
      }

      canRun = await this.handleCommand(ctx)
      if (!canRun) return

      // If there was a found group then parse any command flags else the group variable gets set to the command group
      let flag
      if (group && !cmd) {
        ctx.group = group
        flag = await this.argumentParser.parseFlags(group, args, ctx)
      } else {
        group = cmd.group
        ctx.group = group
      }
      if (flag || !cmd) return

      flag = await this.argumentParser.parseFlags(cmd, args, ctx)
      // Parses any command flags, if a command flag was found it runs it and then returns
      if (flag) return

      // Parses any arguments, if there's an error then say the error and return
      let parsedArgs
      if (cmd.args) {
        parsedArgs = await this.argumentParser.parseArgs(cmd, args, ctx)
      }

      await cmd.run(ctx, parsedArgs)

      this.postCommand(ctx)
    } catch (e) {
      if (e.type === 'friendly') {
        ctx.error(e.message, e)
      } else {
        this.logger.error(`[Dispatcher]: ${e.message}\nStack trace: ${e.stack}`)
        ctx.error('Something went wrong!', e)
      }
    }
  }
}

export default dispatcher
