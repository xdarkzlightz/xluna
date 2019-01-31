import { Collection } from 'discord.js'

import { ArgumentParser, CTX } from '@engines/eclipse/core'
import { dev } from '@engines/eclipse/util/other'

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

  // Runs before the command gets handled, sets up variables & CTX
  // Emits an pre-command event to the client so you can do things before the command runs
  // Using CTX
  async preCommand (ctx) {
    ctx.init()
    if (ctx.msg.author.bot) return false
    if (ctx.msg.channel.type === 'dm') return false

    this.client.emit('preCommand', ctx)

    const mentionsBot = ctx.msg.mentions.members.get(ctx.client.user.id)
    if (mentionsBot) {
      ctx.success(`Current bot prefix is: ${ctx.prefix}`)
      return false
    }

    const content = ctx.msg.content
    if (!content.startsWith(ctx.prefix)) return false
    if (content.startsWith(ctx.prefix + ' ')) return false

    const cmd = this.getCommand(ctx)
    if (!cmd) return false
    if (ctx.cmd) this.logger.debug(`[Dispatcher]: Command: ${ctx.cmd.name}`)
    if (ctx.group) this.logger.debug(`[Dispatcher: Group ${ctx.group.name}`)
    this.logger.debug(
      `[Dispatcher]: User is an admin? ${ctx.member.hasPermission(
        'ADMINISTRATOR'
      )}`
    )

    return true
  }

  // Runs after a command is found or group is found
  // This determines if the command should actually run
  // Emits a command event so you can modify CTX at this state
  // And check to see if the command should actually run
  async handleCommand (ctx) {
    this.client.emit('command', ctx)

    const { cmd } = ctx
    if (cmd && cmd.devOnly && !dev(ctx)) return

    let cooldown = false
    if (cmd) cooldown = this.handleCooldown(ctx)
    if (cooldown) return false

    // If the command/group was disabled return, if there is no DB handleDB() will return true
    if (
      cmd &&
      !ctx.member.hasPermission('ADMINISTRATOR') &&
      !this.handleDB(ctx)
    ) {
      return false
    }

    if (cmd && cmd.nsfw && !ctx.channel.nsfw) {
      ctx.error('Cannot run nsfw commands in non nsfw channels')
      return false
    }

    // If there was a found group then parse any command flags else the group variable gets set to the command group
    const flag = await this.argumentParser.parseFlags(ctx)

    if (flag || !cmd) return false

    // Parses any arguments, if there's an error then say the error and return
    let parsedArgs
    if (cmd.args) parsedArgs = await this.argumentParser.parseArgs(cmd, ctx)

    await cmd.run(ctx, parsedArgs)
    return true
  }

  async postCommand (ctx) {
    if (ctx.guild && ctx.guild.db) {
      await ctx.guild.db.save()
    }

    if (ctx.author.db) {
      await ctx.db.saveUser(ctx.author.db)
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
      let canRun = await this.preCommand(ctx)
      if (canRun) await this.handleCommand(ctx)
      await this.postCommand(ctx)
    } catch (e) {
      this.postCommand(ctx)
      if (e.type === 'friendly') {
        ctx.error(e.message, e)
      } else {
        this.logger.error(`[Dispatcher]: ${e.message}\nStack trace: ${e.stack}`)
        ctx.error('Something went wrong!', e)
      }
    }
  }
  /**
   * Parses the message from the ctx object and gets a command or group
   * @param  {ctx object} ctx An object contaning helper functions and proprety shortcuts
   */
  getCommand (ctx) {
    this.logger.debug(
      `[Dispatcher]: Getting command from message ${ctx.msg.id}`
    )
    const args = ctx.msg.content
      .slice(ctx.prefix.length)
      .trim()
      .split(/ +/g)

    const name = args.shift().toLowerCase()

    // Checks if there's a command with the name variable
    // If no command was found then check if there's an alias with the name
    ctx.cmd = this.registry.commands.get(name)
    if (!ctx.cmd) ctx.cmd = this.registry.aliases.get(name)

    // Checks if there's a group with the name variable
    // If no group was found then check if there's an alias
    ctx.group = this.registry.groups.get(name)
    if (!ctx.group) ctx.group = this.registry.groupAliases.get(name)

    // If there was a found group but not a found command then
    // check if the group has a registered command with the first argument
    if (!ctx.cmd && ctx.group) {
      ctx.cmd = ctx.group.commands.get(args[0])
      if (!ctx.cmd) ctx.cmd = ctx.group.commandAliases.get(args[0])
      if (ctx.cmd) args.shift()
    }

    if (!ctx.group && !ctx.cmd) return false
    if (ctx.cmd && !ctx.group) ctx.group = ctx.cmd.group

    ctx.args = args
    return true
  }

  handleCooldown ({ cmd, author, error }) {
    if (!cmd || !cmd.cooldown) return false
    let strikes = cmd.strikes.get(author.id)
    if (cmd.userCooldowns.has(author.id)) {
      if (cmd.messageCooldowns.has(author.id)) {
        return true
      } else {
        cmd.messageCooldowns.set(author.id, author)
        setTimeout(() => {
          cmd.messageCooldowns.delete(author.id)
        }, 1000)
        error(`This command is on cooldown!`)
      }
      return true
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
      return true
    } else {
      if (!strikes) {
        cmd.strikes.set(author.id, 0)
        strikes = cmd.strikes.get(author.id)
      }
      cmd.strikes.set(author.id, strikes + 1)
      setTimeout(() => cmd.strikes.delete(author.id), cmd.cooldown.timer * 1000)
      return false
    }
  }

  handleDB (ctx) {
    if (ctx.cmd && (ctx.cmd.devOnly || ctx.cmd.group.devOnly)) return true

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
}

export default dispatcher
