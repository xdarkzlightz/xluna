const expect = require('expect')
const { Collection } = require('discord.js')

const GameEngine = require('../../../src/game-engine/game-engine')
const UnoGame = require('../../../src/modules/uno/uno')

let gameEngine
before(() => {
  gameEngine = new GameEngine()
  gameEngine.registerGame('uno', UnoGame)
})

describe('uno-game', () => {
  let game
  before(() => {
    gameEngine.newGame('uno', {
      maxPlayers: 10,
      id: '123',
      startingHandLength: 7
    })
    game = gameEngine.gamestorage.get('123')
  })

  afterEach(() => {
    game.players = new Collection()
  })

  describe('#createUnoDeck', () => {
    it('should create a new uno deck', () => {
      const deck = game.createUnoDeck()

      expect(deck.length).toBe(108)
    })
  })
})
