const path = require('path')

const { EclipseClient } = require('../src/eclipse-engine/eclipse.js')
const GameEngine = require('../src/game-engine/game-engine')

const TestGame = require('./modules/test-card-game/testGame')
const { token, devs, dbString } = require('../src/config')

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

  // Add a game engine property to the eclipse client and set it to the game engine class
  Client.gameEngine = new GameEngine()

  Client.gameEngine.on('GameEngine-debug', msg =>
    console.log(`[Game-Engine]: ${msg}`)
  )

  Client.gameEngine.registerGame('TestGame', TestGame)

  Client.login()

  Client.on('ready', () => console.log('Bot ready!'))
})()
