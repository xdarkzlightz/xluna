import { Collection } from 'discord.js'
import { promisify } from 'util'
import { join } from 'path'

import { Command, Group } from '@eclipse/command'
import { Guild } from '@eclipse/database/'

import { asyncForEach, findName, removeFromArray } from '@eclipse/util/array'

const readdir = promisify(require('fs').readdir)

/**
 * This class handles registering commands, groups, and updates groups/commands or removes them from the database
 */
class Registry {
  /**
   * Creates a new registry
   * @param {EclipseClient} client
   */
  constructor (client) {
    // Eclipse Client
    this.client = client
    this.logger = client.logger

    this.groupPath = client.path

    this.commands = new Collection()
    this.groups = new Collection()

    this.logger.debug('[Eclipse-Engine]: Created registry')
  }

  /**
   * This initalizes the registry, it registers groups, registers commands, and updates the database
   * @return {Promise}           Promise wrapper
   */
  async init () {
    try {
      this.logger.info('[Registry]: Registering groups')
      await this.registerGroupsIn(this.groupPath)
      await this.registerGroupsIn(join(__dirname, '/builtin-groups/'))
      this.logger.info('[Registry]: Done registering groups')

      this.registerCommands()

      this.logger.info('[Registry]: Updating database documents')
      await this.updateDatabase()
      this.logger.info('[Registry]: Done updating database documents')
    } catch (e) {
      this.logger.error(`[Registry]: ${e}\n Stack Trace: ${e.stack}`)
    }
  }

  /**
   * Registers all the group file in a path
   * @param  {string}  groupPath The path you want to look in
   * @return {Promise}           Promise wrapper
   */
  async registerGroupsIn (groupPath) {
    this.logger.debug(
      `[Registry]: Getting command group files from ${this.groupPath}`
    )
    const groups = await readdir(groupPath)
    groups.forEach(group => {
      if (!group.endsWith('.js')) return
      this.loadGroup(groupPath, group)
    })
  }

  /**
   * Loads a group from the path and group name
   * @param  {string} groupPath The path you want to get the group from
   * @param  {string} groupName The name of the group
   */
  loadGroup (groupPath, groupName) {
    this.logger.debug(`[Registry]: Registering group ${groupName}`)
    const groupObject = require(join(groupPath, '/', groupName))

    if (!groupObject.GroupConfig) {
      throw new Error(`Could not register group ${groupName}, missing config`)
    } else if (!groupObject.GroupConfig.name) {
      throw new Error(
        `Could not register group ${groupName}, missing config name property`
      )
    }

    const group = new Group(this.client, groupPath, groupObject)
    if (this.groups.has(group.name)) {
      throw new Error(
        `Could not register group ${group.name}, a group already exists`
      )
    }

    this.groups.set(group.name, group)

    this.logger.debug(`[Registry]: Registered group ${group.name}`)
  }

  /**
   * Registers the commands in the registered groups
   */
  registerCommands () {
    this.groups.array().forEach(group => {
      this.logger.info(`[Registry Group: ${group.name}] Registering commands`)

      // Creates a copy of the group object and removes the config so now we're left with only the commands
      const commands = Object.assign({}, group.group)
      delete commands.GroupConfig

      // Loop through the command properties
      Object.keys(commands).forEach(prop => {
        const command = commands[prop]
        this.loadCommand(prop, group, command)
      })

      this.logger.info(
        `[Registry Group: ${group.name}] Done registering commands`
      )
    })
  }

  /**
   * Loads in a command
   * @param  {string}        cmdName The commands name
   * @param  {Eclipse Group} group   The group the command belongs to
   * @param  {cmd object}    cmd     The command object you're registering
   */
  loadCommand (cmdName, group, cmd) {
    this.logger.debug(
      `[Registry Group: ${group.name}]: Registering command ${cmdName}`
    )
    // Checks if the command has the run property
    if (!cmd.run) {
      throw new Error(
        `Command ${cmdName} not registered: Missing the run property`
      )
    } else if (this.commands.has(cmdName)) {
      throw new Error(
        `could not register ${cmdName}, a command with the name ${cmdName} already exists`
      )
    }

    // Creates a command config if one is not provided
    if (!cmd.config) cmd.config = { rating: 0 }

    // Sets the command name and group in the command config
    cmd.config.name = cmdName
    cmd.config.group = group.name

    // Creates a new Command and adds it to the commands collection
    const command = new Command(this.client, cmd)
    if (cmd.config.flags) command.registerFlags(cmd.config.flags)

    group.commands.set(cmdName, command)
    this.commands.set(cmdName, command)

    this.logger.debug(
      `[Registry Group: ${group.name}]: Command ${cmdName} registered`
    )
  }

  /**
   * Unloads the specified command
   * @param  {Eclipse Command} cmd The eclipse command you want to target
   * @return {string}              The string response
   */
  unloadCommand (cmd) {
    this.logger.info(`[Registry]: unloading ${cmd.name}`)
    const group = this.groups.get(cmd.group)
    const cmdDeleted = group.commands.delete(cmd.name)
    if (this.commands.has(cmd.name)) this.commands.delete(cmd.name)
    if (cmdDeleted) {
      this.logger.info(`[Registry]: unloaded ${cmd.name}`)
      return `Command ${cmd.name}: unloaded`
    }
  }

  /**
   * Unloads the specified command
   * @param  {Eclipse Command} cmd The eclipse command you want to target
   * @return {string}              The string response
   */
  reloadCommand (cmd) {
    this.logger.info(`[Registry]: reloading ${cmd.name}`)

    this.unloadCommand(cmd)

    const group = this.groups.get(cmd.group)

    const modPath = join(group.path, '/', `${cmd.group}.js`)
    delete require.cache[require.resolve(modPath)]
    const groupObject = require(modPath)

    // Creates a copy of the group object and removes the config so now we're left with only the commands
    const commands = Object.assign({}, groupObject)
    delete commands.GroupConfig

    // Loop through the command properties
    Object.keys(commands).forEach(prop => {
      if (prop === cmd.name) {
        const command = commands[prop]
        this.loadCommand(prop, group, command)
      }
    })
    this.logger.info(`[Registry]: reloaded ${cmd.name}`)
    return `Command ${cmd.name}: reloaded`
  }

  /**
   * Unloads a group from the group collection
   * @param  {Eclipse group} group The target group
   * @return {string}              The string response
   */
  unloadGroup (group) {
    this.logger.info(`[Registry]: Unloading ${group.name}`)

    group.commands.array().forEach(cmd => {
      this.unloadCommand(cmd)
    })
    const groupDeleted = this.groups.delete(group.name)
    if (groupDeleted) {
      this.logger.info(`[Registry]: Unloaded ${group.name}`)
      return `Group ${group.name}: unloaded`
    }
  }

  /**
   * Unloads a group from the group collection
   * @param  {Eclipse group} group The target group
   * @return {string}              The string response
   */
  reloadGroup (oldGroup) {
    this.logger(`[Registry]: Reloading ${oldGroup.name}`)
    this.unloadGroup(oldGroup)
    const modPath = join(oldGroup.path, '/', `${oldGroup.name}.js`)
    delete require.cache[require.resolve(modPath)]

    this.loadGroup(oldGroup.path, oldGroup.name + '.js')
    const newGroup = this.groups.get(oldGroup.name)

    const groupObject = newGroup.group

    // Creates a copy of the group object and removes the config so now we're left with only the commands
    const commands = Object.assign({}, groupObject)
    delete commands.group_config

    // Loop through the command properties
    Object.keys(commands).forEach(prop => {
      const command = commands[prop]
      this.loadCommand(prop, newGroup, command)
    })

    this.logger(`[Registry]: Reloaded ${oldGroup.name}`)
    return `Group ${newGroup.name}: reloaded`
  }

  /**
   * This method updates the database with any new groups or commands added
   * @return {Promise}  Promise wrapper
   */
  async updateDatabase () {
    const dbs = await Guild.find({})
    await asyncForEach(dbs, async db => {
      const _db = await Guild.findOne({ id: db.id })
      const rating = _db.config.rating
      this.groups.forEach(group => {
<<<<<<< HEAD
        _db.roles.forEach(role => {
          const groupDB = findName(role.groups, group.name)
          if (groupDB) {
            group.commands.forEach(cmd => {
              const hasCommand = findName(groupDB.commands, cmd.name)
              if (hasCommand) return
              const commandSchema = cmd.createSchema(_db.config.rating)
              groupDB.commands.push(commandSchema)
            })
            return
          }
          const groupSchema = group.createSchema(_db.config.rating)
          role.groups.push(groupSchema)
        })
        _db.channels.forEach(channel => {
          const groupDB = findName(channel.groups, group.name)
          if (groupDB) {
            group.commands.forEach(cmd => {
              const hasCommand = findName(groupDB.commands, cmd.name)
              if (hasCommand) return
              const commandSchema = cmd.createSchema(_db.config.rating)
              groupDB.commands.push(commandSchema)
            })
            return
          }
          const groupSchema = group.createSchema(_db.config.rating)
          channel.groups.push(groupSchema)
        })
        _db.members.forEach(member => {
          const groupDB = findName(member.groups, group.name)
          if (groupDB) {
            group.commands.forEach(cmd => {
              const hasCommand = findName(groupDB.commands, cmd.name)
              if (hasCommand) return
              const commandSchema = cmd.createSchema(_db.config.rating)
              groupDB.commands.push(commandSchema)
            })
            return
          }
          const groupSchema = group.createSchema(_db.config.rating)
          member.groups.push(groupSchema)
        })
=======
        _db.roles.forEach(role => this.updateCommands(role, group, rating))

        _db.channels.forEach(channel =>
          this.updateCommands(channel, group, rating)
        )

        _db.members.forEach(member =>
          this.updateCommands(member, group, rating)
        )
>>>>>>> eclipse-engine/registryRefactor
      })

      _db.roles.forEach(role => this.removeCommands(role))
      _db.channels.forEach(channel => this.removeCommands(channel))
      _db.members.forEach(member => this.removeCommands(member))

      await _db.save()
    })
  }

  updateCommands (type, group, rating) {
    const groupDB = findName(type.groups, group.name)
    if (groupDB) {
      group.commands.forEach(cmd => {
        const hasCommand = findName(groupDB.commands, cmd.name)
        if (hasCommand) return
        const commandSchema = cmd.createSchema(rating)
        groupDB.commands.push(commandSchema)
      })
      return
    }
    const groupSchema = group.createSchema(rating)
    type.groups.push(groupSchema)
  }

  removeCommands (type) {
    type.groups.forEach(groupDB => {
      const group = this.groups.has(groupDB.name)
      if (group) {
        groupDB.commands.forEach(cmd => {
          const hasCommand = this.commands.get(cmd.name)
          if (hasCommand) return

          removeFromArray(groupDB.commands, cmd)
        })
        return
      }
      removeFromArray(type.groups, groupDB)
    })
  }
}

export default Registry
