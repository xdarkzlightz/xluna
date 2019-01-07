const expect = require('expect')

const GameEngine = require('../../../src/game-engine/game-engine')
const BaseGame = require('../../../src/game-engine/base-types/game')

let gameEngine
before(() => {
  gameEngine = new GameEngine()
  gameEngine.registerGame('TestGame', BaseGame)
})

describe('game-engine', () => {
  it('should initialize the game-engine', () => {
    expect(gameEngine).toBeInstanceOf(GameEngine)
  })

  describe('#registerGame', () => {
    it('should register a new game', () => {
      expect(gameEngine.games.has('TestGame')).toBe(true)
    })
  })

  describe('#newGame', () => {
    let game
    beforeEach(() => {
      game = gameEngine.newGame('TestGame', {
        id: '123',
        maxPlayers: 10,
        owner: '123456'
      })
    })

    afterEach(() => {
      gameEngine.gamestorage.delete('123')
    })

    it('should add a new game to the gamestorage property', () => {
      expect(gameEngine.gamestorage.has('123')).toBe(true)
    })

    it('should return true when a game gets created', () => {
      expect(game).toBe(true)
    })

    it('should return false when a game with the same id is already registered', () => {
      let game = gameEngine.newGame('TestGame', {
        id: '123',
        maxPlayers: 10
      })
      expect(game).toBe(false)
    })
  })
})
