import { ArgumentParser, CTX } from '@eclipse/core'
import { findID } from '@eclipse/util/array'
import { commandEnabledFor } from '@eclipse/database'
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

      if (!canRun && !mentionsBot) return

      ctx.cmd = cmd
      if (this.userCooldowns.has(ctx.author.id)) {
        return
      } else {
        this.userCooldowns.set(ctx.author.id, ctx.author)
        setTimeout(() => {
          this.userCooldowns.delete(ctx.author.id)
        }, 2000)
      }

      if (mentionsBot) {
        return ctx.success(`Current bot prefix is: ${ctx.prefix}`)
      }

      if (!ctx.db && cmd.name !== 'config') {
        return ctx.error(
          'You need to create a guild config before running commands! Create one with /config'
        )
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

      // If the command/group was disabled return, if there is no DB handleDB() will return true
      if (!this.handleDB(cmd, ctx)) return

      if (cmd.nsfw && !ctx.channel.nsfw) {
        return ctx.error('Cannot run nsfw commands in non nsfw channels')
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
      if (response.cmd) response.args.shift()
      if (!response.cmd) response.cmd = response.group.commandAliases.get(name)
    }

    if (!response.group && !response.cmd & !mentionsBot) response.canRun = false
    return response
  }

  handleDB (cmd, ctx) {
    if (!ctx.db) return true
    if (cmd.devOnly || cmd.group.devOnly) return true

    let enabled = commandEnabledFor('member', ctx.author.id, cmd, ctx.db)

    if (enabled === undefined) {
      const roles = ctx.db.roles
      let roleEnabled

      roles.forEach(roleDB => {
        if (roleEnabled) return
        const memberRole = ctx.msg.member.roles.get(roleDB.id)
        if (!memberRole) return

        const foundRole = findID(roles, memberRole.id)
        roleEnabled = commandEnabledFor('role', foundRole.id, cmd, ctx.db)
      })
      enabled = roleEnabled
    }

    const channelEnabled = commandEnabledFor(
      'channel',
      ctx.channel.id,
      cmd,
      ctx.db
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
