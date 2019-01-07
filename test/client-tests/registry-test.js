const path = require('path')

const { EclipseClient } = require('../src/eclipse-engine/eclipse.js')

const Client = new EclipseClient({
  path: path.join(__dirname, '/command-groups/')
})

// Run our test command after the groups and commands are registered
Client.registry.registerGroupsAndCommands(client =>
  client.registry.commands.get('test').run()
)
