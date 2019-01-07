const path = require('path')

const { EclipseClient } = require('../src/eclipse-engine/eclipse.js')

const Client = new EclipseClient({
  token: '',
  path: path.join(__dirname, '/command-groups/'),
  prefix: '/',
  devs: [],
  dbString: ''
})

// Use an IIFE to initialize the bot
;(async () => {
  await Client.database.connect()
  await Client.registry.init()
  Client.login()
})()

Client.on('ready', () => console.log('Bot ready!'))
