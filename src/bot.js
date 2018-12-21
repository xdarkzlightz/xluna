const path = require('path')
const { token, devs, dbString } = require('./config')

const { EclipseClient } = require('../src/eclipse-engine/eclipse.js')

const Client = new EclipseClient({
  token: token,
  path: path.join(__dirname, '/command-groups/'),
  prefix: '/',
  devs: devs,
  dbString: dbString
})

// Use an IIFE to initialize the bot
;(async () => {
  await Client.database.connect()
  await Client.registry.init()
  Client.login()
})()

Client.on('ready', () => console.log('Bot ready!'))
