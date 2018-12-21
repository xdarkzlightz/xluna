const { Collection } = require('discord.js')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)
const path = require('path')

const Group = require('./commands/group')
const Command = require('./commands/command')
const Guild = require('./models/guild')

const util = require('./util/util')

/**
 * This class handles registering commands, groups, and updates groups/commands or removes them from the database
 */
class Registry {
  constructor (client) {
    // Eclipse Client
    this.client = client

    this.groupPath = client.path

    this.commands = new Collection()
    this.groups = new Collection()
  }

  /**
   * This initalizes the registry, it registers groups, registers commands, and updates the database
   * @return {Promise}           Promise wrapper
   */
  async init () {
    try {
      util.log('Registry', `Registering groups`)
      await this.registerGroupsIn(this.groupPath)
      await this.registerGroupsIn(
        path.join(__dirname, 'commands/builtin-groups/')
      )
      util.log('Registry', `Done registering groups\n`)

      this.registerCommands()

      util.log('Database', `Updating databases\n`)
      await this.updateDatabase()
      await this.removeUnused()
      util.log('Database', `Done updating databases\n`)
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Registers all the group file in a path
   * @param  {string}  groupPath The path you want to look in
   * @return {Promise}           Promise wrapper
   */
  async registerGroupsIn (groupPath) {
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
    const groupObject = require(path.join(groupPath, '/', groupName))

    if (!groupObject.hasOwnProperty('group_config')) {
      return console.log(`${groupName} not registered, missing config`)
    } else if (!groupObject.group_config.hasOwnProperty('name')) {
      return console.log(`${groupName} not registered, missing name property`)
    }

    const group = new Group(this.client, groupPath, groupObject)
    if (this.groups.has(group.name)) {
      return console.log(
        `${groupName} not registered, a group with the name ${
          group.name
        } already exists`
      )
    }

    util.log('Registry', `Registering group: ${group.name}`)

    this.groups.set(group.name, group)

    util.log('Registry', `Registered group: ${group.name}`)
  }

  /**
   * Registers the commands in the registered groups
   */
  registerCommands () {
    this.groups.array().forEach(group => {
      util.log(`Group: ${group.name}`, 'Registering commands')

      // Creates a copy of the group object and removes the config so now we're left with only the commands
      const commands = Object.assign({}, group.group)
      delete commands.group_config

      // Loop through the command properties
      Object.keys(commands).forEach(prop => {
        const command = commands[prop]
        this.loadCommand(prop, group, command)
      })

      util.log(`Group: ${group.name}`, 'Done registering commands\n')
    })
  }

  /**
   * Loads in a command
   * @param  {string}        cmdName The commands name
   * @param  {Eclipse Group} group   The group the command belongs to
   * @param  {cmd object}    cmd     The command object you're registering
   */
  loadCommand (cmdName, group, cmd) {
    // Checks if the command has the run property
    if (!cmd.hasOwnProperty('run')) {
      return console.log(
        `Command ${cmdName} not registered: Missing the run property`
      )
    } else if (this.commands.has(cmdName)) {
      util.log(
        `Group: ${group.name}`,
        `could not register ${cmdName}, a command with the name ${cmdName} already exists`
      )
    }

    // Creates a command config if one is not provided
    if (!cmd.hasOwnProperty('config')) {
      cmd.config = { args: [], devOnly: false, rating: 0 }
    }

    // Sets the command name and group in the command config
    cmd.config.name = cmdName
    cmd.config.group = group.name

    // Creates a new Command and adds it to the commands collection
    const command = new Command(this.client, cmd)

    util.log(`Group: ${group.name}`, `Registering command ${cmdName}`)

    group.commands.set(cmdName, command)
    this.commands.set(cmdName, command)

    util.log(`Group: ${group.name}`, `Command ${cmdName} registered`)
  }

  /**
   * Unloads the specified command
   * @param  {Eclipse Command} cmd The eclipse command you want to target
   * @return {string}              The string response
   */
  unloadCommand (cmd) {
    util.log('registry', `unloading ${cmd.name}`)
    const group = this.groups.get(cmd.group)
    const cmdDeleted = group.commands.delete(cmd.name)
    if (this.commands.has(cmd.name)) this.commands.delete(cmd.name)
    if (cmdDeleted) {
      return `Command ${cmd.name}: unloaded`
    }
  }

  /**
   * Unloads the specified command
   * @param  {Eclipse Command} cmd The eclipse command you want to target
   * @return {string}              The string response
   */
  reloadCommand (cmd) {
    util.log('registry', `reloading ${cmd.name}`)

    this.unloadCommand(cmd)

    const group = this.groups.get(cmd.group)

    const modPath = path.join(group.path, '/', `${cmd.group}.js`)
    delete require.cache[require.resolve(modPath)]
    const groupObject = require(modPath)

    // Creates a copy of the group object and removes the config so now we're left with only the commands
    const commands = Object.assign({}, groupObject)
    delete commands.group_config

    // Loop through the command properties
    Object.keys(commands).forEach(prop => {
      if (prop === cmd.name) {
        const command = commands[prop]
        console.log(command)
        this.loadCommand(prop, group, command)
      }
    })

    return `Command ${cmd.name}: reloaded`
  }

  /**
   * Unloads a group from the group collection
   * @param  {Eclipse group} group The target group
   * @return {string}              The string response
   */
  unloadGroup (group) {
    util.log('registry', `unloading ${group.name}`)
    group.commands.array().forEach(cmd => {
      this.unloadCommand(cmd)
    })
    const groupDeleted = this.groups.delete(group.name)
    if (groupDeleted) {
      return `Group ${group.name}: unloaded`
    }
  }

  /**
   * Unloads a group from the group collection
   * @param  {Eclipse group} group The target group
   * @return {string}              The string response
   */
  reloadGroup (oldGroup) {
    util.log('registry', `reloading ${oldGroup.name}`)
    this.unloadGroup(oldGroup)
    const modPath = path.join(oldGroup.path, '/', `${oldGroup.name}.js`)
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

    return `Group ${newGroup.name}: reloaded`
  }

  /**
   * This method updates the database with any new groups or commands added
   * @return {Promise}  Promise wrapper
   */
  async updateDatabase () {
    const dbs = await Guild.find({})
    await util.asyncForEach(dbs, async db => {
      const _db = await Guild.findOne({ id: db.id })
      this.groups.forEach(group => {
        _db.roles.forEach(role => {
          const groupDB = util.findName(role.groups, group.name)
          if (groupDB) {
            group.commands.forEach(cmd => {
              const hasCommand = util.findName(groupDB.commands, cmd.name)
              if (hasCommand) return
              const commandSchema = cmd.createSchema(_db.config.rating)
              groupDB.commands.push(commandSchema)
            })
            return
          }
          const groupSchema = group.createSchema(_db.config.rating)
          console.log(groupSchema)
          role.groups.push(groupSchema)
        })
        _db.channels.forEach(channel => {
          const groupDB = util.findName(channel.groups, group.name)
          if (groupDB) {
            group.commands.forEach(cmd => {
              const hasCommand = util.findName(groupDB.commands, cmd.name)
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
          const groupDB = util.findName(member.groups, group.name)
          if (groupDB) {
            group.commands.forEach(cmd => {
              const hasCommand = util.findName(groupDB.commands, cmd.name)
              if (hasCommand) return
              const commandSchema = cmd.createSchema(_db.config.rating)
              groupDB.commands.push(commandSchema)
            })
            return
          }
          const groupSchema = group.createSchema(_db.config.rating)
          member.groups.push(groupSchema)
        })
      })
      await _db.save()
    })
  }

  /**
   * Removes any groups/commands that aren't registered
   * @return {Promise} Promise wrapper
   */
  async removeUnused () {
    const dbs = await Guild.find({})
    await util.asyncForEach(dbs, async db => {
      const _db = await Guild.findOne({ id: db.id })
      _db.roles.forEach(role => {
        role.groups.forEach(groupDB => {
          const group = this.groups.has(groupDB.name)
          if (group) {
            groupDB.commands.forEach(cmd => {
              const hasCommand = this.commands.get(cmd.name)
              if (hasCommand) return

              util.removeFromArray(groupDB.commands, cmd)
            })
            return
          }
          util.removeFromArray(role.groups, groupDB)
        })
      })

      _db.channels.forEach(channel => {
        channel.groups.forEach(groupDB => {
          const group = this.groups.has(groupDB.name)
          if (group) {
            groupDB.commands.forEach(cmd => {
              const hasCommand = this.commands.get(cmd.name)
              if (hasCommand) return

              util.removeFromArray(groupDB.commands, cmd)
            })
            return
          }
          util.removeFromArray(channel.groups, groupDB)
        })
      })

      _db.members.forEach(member => {
        member.groups.forEach(groupDB => {
          const group = this.groups.has(groupDB.name)
          if (group) {
            groupDB.commands.forEach(cmd => {
              const hasCommand = this.commands.get(cmd.name)
              if (hasCommand) return

              util.removeFromArray(groupDB.commands, cmd)
            })
            return
          }
          util.removeFromArray(member.groups, groupDB)
        })
      })
      await _db.save()
    })
  }
}

module.exports = Registry
