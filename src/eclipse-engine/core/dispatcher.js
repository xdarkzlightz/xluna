import { ArgumentParser, CTX } from '@eclipse/core'
// import { findID } from '@eclipse/util/array'
import { checkForClientPerms, checkForMemberPerms } from '@eclipse/util/other'

// import { commandEnabledFor } from '@eclipse/database'
import { Collection } from 'discord.js'

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

      await ctx.init()

      let { canRun, cmd, group, args, mentionsBot } = this.parseMessage(ctx)
      ctx.cmd = cmd

      if (!canRun && !mentionsBot) return

      const noCooldown = this.handleCooldown(ctx)
      if (!noCooldown) return

      if (mentionsBot) {
        return ctx.success(`Current bot prefix is: ${ctx.prefix}`)
      }
      this.logger.debug(`[Dispatcher]: Command: ${cmd}`)
      this.logger.debug(
        `[Dispatcher]: User is an admin? ${ctx.member.hasPermission(
          'ADMINISTRATOR'
        )}`
      )
      this.logger.debug(
        `Dispatcher: Command enabled: ${this.handleDB(cmd, ctx)}\n`
      )

      // Get rid of this in the future and handle it outside of eclipse
      if (!ctx.db && cmd.name !== 'config') {
        return ctx.error(
          'You need to create a guild config before running commands! Create one with /config'
        )
      }

      this.logger.debug(
        `[Dispatcher] Database check resulting in: ${cmd &&
          !ctx.member.hasPermission('ADMINISTRATOR') &&
          !this.handleDB(cmd, ctx)}`
      )
      // If the command/group was disabled return, if there is no DB handleDB() will return true
      if (
        cmd &&
        !ctx.member.hasPermission('ADMINISTRATOR') &&
        !this.handleDB(cmd, ctx)
      ) {
        return
      }

      // If there was a found group then parse any command flags else the group variable gets set to the command group
      let flag
      if (group && !cmd) {
        ctx.group = group
        flag = await this.argumentParser.parseFlags(group, args, ctx)
      } else {
        group = cmd.group
        ctx.group = group
      }
      if (flag) return
      if (!cmd) return

      if (
        (group.devOnly || cmd.devOnly) &&
        this.devs.indexOf(ctx.author.id) === -1
      ) {
        return
      }

      this.logger.debug(`[Dispatcher]: Parsing flag`)
      flag = await this.argumentParser.parseFlags(cmd, args, ctx)
      // Parses any command flags, if a command flag was found it runs it and then returns
      if (flag) return

      if (cmd.nsfw && !ctx.channel.nsfw) {
        return ctx.error('Cannot run nsfw commands in non nsfw channels')
      }

      if (cmd.clientPermissions) {
        const { perm, missingPerm } = checkForClientPerms(ctx)
        if (!perm) {
          return ctx.error(
            `Could not run command! I'm missing permission: ${missingPerm.toLowerCase()}`
          )
        }
      }

      if (cmd.memberPermissions) {
        const { perm, missingPerm } = checkForMemberPerms(ctx)
        if (!perm) {
          return ctx.error(
            `Could not run command! I'm missing permission: ${missingPerm.toLowerCase()}`
          )
        }
      }

      // Parses any arguments, if there's an error then say the error and return
      let parsedArgs
      if (cmd.args) {
        parsedArgs = await this.argumentParser.parseArgs(cmd, args, ctx)
      }

      await cmd.run(ctx, parsedArgs)
    } catch (e) {
      if (e.type === 'friendly') {
        ctx.error(e.message, e)
      } else {
        this.logger.error(`[Dispatcher]: ${e.message}\nStack trace: ${e.stack}`)
        ctx.error('Something went wrong!', e)
      }
    }
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

  handleDB (cmd, ctx) {
    if (!ctx.guild.db) return true
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
}

export default dispatcher
