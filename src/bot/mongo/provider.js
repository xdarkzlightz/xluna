import { Collection } from 'discord.js'
import mongoose from 'mongoose'

import { asyncForEach } from '@util/array'

import Guild from './models/guild'
import User from './models/user'
import MongoGuild from './types/guild/guild'
import MongoUser from './types/user/user'

// TODO: MAKE AN EXTENSION OF THE PROVIDER TO HANDLE USERS + OTHER EXTENSIONS
class mongoProvider {
  constructor (dbString, client) {
    this.dbString = dbString
    this.client = client
    this.logger = client.logger

    // Cache of all guilds in the database
    this.guilds = new Collection()

    // Cache of all the users in the database
    this.users = new Collection()
  }

  // Connects to the mongodb database
  async connect () {
    mongoose.set('debug', (collectionName, methodName, arg1, arg2) => {
      this.logger.debug(
        `[Mongoose]: ${collectionName}.${methodName}(${JSON.stringify(
          arg1
        )}, ${JSON.stringify(arg2)}`
      )
    })

    mongoose.connect(this.dbString, { useNewUrlParser: true })
    mongoose.connection
      .once('open', () => this.logger.info('[Mongoose]: Database connected!'))
      .on('error', err => {
        this.logger.error(
          `Something went wrong: ${err}\n Call stack: ${err.stack}`
        )
      })
  }

  /** Connects to the database and caches all guilds */
  // TODO: EXTEND PROVIDER AND MOVE USERS TO IT'S OWN EXTENSION
  async init () {
    await this.connect()
    await this.cache()
  }

  /** Creates a new guild config for guilds that don't have one */
  async updateGuilds (migration) {
    await asyncForEach(this.client.guilds.array(), async guild => {
      if (this.guilds.has(guild.id)) return
      const dbGuild = this.newGuild(this.client.prefix, guild.id)
      this.logger.info(`[Database]: Added new guild ${guild.id}`)
      await dbGuild.data.save()
    })

    await asyncForEach(this.guilds.array(), async guild => {
      const db = guild.data
      migration(db)
      await db.save()
      this.logger.info(`[Database]: Migrated ${guild.data.id}`)
    })
  }

  /** Caches all of the bots guilds */
  async cache () {
    const guilds = await Guild.find({})

    guilds.forEach(guild => {
      this.guilds.set(guild.id, new MongoGuild(guild, this))
    })

    const users = await User.find({})

    users.forEach(user => {
      this.users.set(user.id, new MongoUser(user, this))
    })
  }
  async newUser (id) {
    const dbUser = new User({
      id: id,
      profile: {}
    })
    await dbUser.save()
    this.users.set(id, new MongoUser(dbUser, this))
    return this.users.get(id)
  }

  /** Creates a new guild document and caches it */
  async newGuild (prefix, id) {
    const groups = this.createGroups(2)
    const config = {
      prefix: prefix,
      rating: 2
    }

    const role = { id: id, groups }

    const dbGuild = new Guild({
      id: id,
      config,
      channels: [],
      roles: [role],
      members: []
    })

    await dbGuild.save()

    this.guilds.set(id, new MongoGuild(dbGuild, this))
    return dbGuild
  }

  /** Checks if a command is enabled for a member
   * Checks if it's enabled for them, and checks if it's enabled for one of their roles
   */
  commandEnabledForMember (ctx) {
    const { guild, cmd, member } = ctx

    const dbGuild = this.guilds.get(guild.id)
    this.logger.debug(`[Database] Found guild: ${dbGuild}`)
    if (!dbGuild) return

    let enabled
    const dbMember = dbGuild.members.get(member.id)
    this.logger.debug(`[Database]: Found member ${dbMember}`)
    if (dbMember && dbMember.commands.size !== 0) {
      this.logger.debug(
        `[Database]: Member Enabled getting set to: ${
          dbMember.commands.get(cmd.name).enabled
        }`
      )
      enabled = dbMember.commands.get(cmd.name).enabled
    }

    if (enabled === undefined) {
      this.logger.debug(
        `[Database]: Role enabled getting set to ${this.enabledForRoles(
          ctx,
          dbGuild.roles
        )}`
      )
      enabled = this.enabledForRoles(ctx, dbGuild.roles)
    }

    this.logger.debug(`[Database]: Returning enabled status ${enabled}`)
    return enabled
  }

  /** Checks if a command is enabled for a members roles by using the roles array */
  enabledForRoles ({ member, cmd }, roles) {
    let roleEnabled = false
    roles.forEach(roleDB => {
      if (roleEnabled) return

      const memberRole = member.roles.get(roleDB.data.id)
      if (!memberRole) return

      const foundRole = roles.get(memberRole.id).commands.get(cmd.name)
      this.logger.debug(`[Database]: Role found: ${foundRole}`)
      if (!foundRole) return
      this.logger.debug(
        `[Database]: Command enabled for role? ${foundRole.enabled}`
      )
      if (foundRole.enabled) roleEnabled = foundRole.enabled
    })

    this.logger.debug(`[Database]: roleEnabled returning ${roleEnabled}`)
    return roleEnabled
  }

  /** Checks if a command is enabled for a channel */
  commandEnabledInChannel ({ channel, cmd }, channels) {
    const dbChannel = channels.get(channel.id)
    if (dbChannel === undefined || !dbChannel.commands.size) return

    const enabled = dbChannel.commands.get(cmd.name).enabled
    if (enabled) return true
    if (!enabled) return false
  }

  /** Updates a command for a data object */
  async updateCommand (enable, arg, ctx) {
    const db = arg.db
    if (db.commands.size === 0) db.addGroups()
    const command = db.commands.get(ctx.cmd.name)
    command.enabled = enable
  }

  /** Updates an entire group */
  async updateGroup (enable, arg, ctx) {
    if (!arg.db.commands.size) arg.db.addGroups()
    const dbGroup = arg.db.groups.get(ctx.group.name)
    dbGroup.commands.forEach(cmd => (cmd.enabled = enable))
  }

  /** Creates an array of group schemas based on the guild rating */
  createGroups (rating) {
    let groups = []
    this.client.registry.groups.forEach(group => {
      if (group.devOnly) return
      groups.push(group.createSchema(rating))
    })

    return groups
  }
}

export default mongoProvider
