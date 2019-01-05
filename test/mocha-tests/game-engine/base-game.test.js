const expect = require('expect')
const { Collection } = require('discord.js')

const GameEngine = require('../../../src/game-engine/game-engine')
const BaseGame = require('../../../src/game-engine/base-types/game')

const BasePlayer = require('../../../src/game-engine/base-types/player')

let gameEngine
before(() => {
  gameEngine = new GameEngine()
  gameEngine.registerGame('TestGame', BaseGame)
})

describe('base-game', () => {
  let game
  before(() => {
    gameEngine.newGame('TestGame', { maxPlayers: 10, id: '123' })
    game = gameEngine.gamestorage.get('123')
  })

  afterEach(() => {
    game.players = new Collection()
  })

  // Handles the turn rotation
  describe('#start', () => {
    it('should set the state.currentPlayer property to a player', () => {
      game.addPlayer(new BasePlayer('123456'))
      game.addPlayer(new BasePlayer('654321'))

      game.start()
      expect(game.state.currentPlayer).toBeInstanceOf(BasePlayer)
    })

    it('should set the game state.started property to true', () => {
      game.addPlayer(new BasePlayer('123456'))
      game.addPlayer(new BasePlayer('654321'))

      game.start()
      expect(game.state.started).toBe(true)
    })

    it('should return true if the game starts', () => {
      game.addPlayer(new BasePlayer('123456'))
      game.addPlayer(new BasePlayer('654321'))

      const started = game.start()
      expect(started).toBe(true)
    })

    it('should return false if the game cannot start', () => {
      game.addPlayer(new BasePlayer('123456'))

      const started = game.start()
      expect(started).toBe(false)
    })
  })

  describe('#nextTurn', () => {
    it('should set the state.currentPlayer property to the next player in the collection', () => {
      game.addPlayer(new BasePlayer('123456'))
      game.addPlayer(new BasePlayer('654321'))

      game.start()

      const originalPlayer = Object.assign({}, game.state.currentPlayer)

      game.nextTurn()

      const newPlayer = game.state.currentPlayer.id

      expect(originalPlayer.id).not.toBe(newPlayer)
    })

    it('should reset the turn rotation if it reaches the end of it', () => {
      game.addPlayer(new BasePlayer('123456'))
      game.addPlayer(new BasePlayer('654321'))

      game.start()

      const originalPlayer = Object.assign({}, game.state.currentPlayer)

      game.nextTurn()
      game.nextTurn()

      const newPlayer = game.state.currentPlayer.id

      expect(originalPlayer.id).toBe(newPlayer)
    })
  })

  describe('#end', () => {
    it('should set the game state.started property to false', () => {
      game.addPlayer(new BasePlayer('123456'))
      game.addPlayer(new BasePlayer('654321'))

      game.start()
      game.end()

      expect(game.state.started).toBe(false)
    })
    it('should set the state.currentPlayer property to undefined', () => {
      game.addPlayer(new BasePlayer('123456'))
      game.addPlayer(new BasePlayer('654321'))

      game.start()
      game.end()

      expect(game.state.currentPlayer).toBe(undefined)
    })

    it('should return true if the game ends', () => {
      game.addPlayer(new BasePlayer('123456'))
      game.addPlayer(new BasePlayer('654321'))

      game.start()
      const ended = game.end()

      expect(ended).toBe(true)
    })
  })

  // Handles removing/adding/getting players
  describe('#addPlayer', () => {
    let player
    beforeEach(() => {
      player = game.addPlayer(new BasePlayer('123456'))
    })

    afterEach(() => {
      game.players.delete('123456')
    })
    it('should add a player to the players collection on the game', () => {
      expect(game.players.has('123456')).toBe(true)
    })

    it('should return true if it adds the player', () => {
      expect(player).toBe(true)
    })

    it("should return false if it can't add the player", () => {
      const newPlayer = game.addPlayer(new BasePlayer('123456'))

      expect(newPlayer).toBe(false)
    })
  })

  describe('#removePlayer', () => {
    let removedPlayer
    beforeEach(() => {
      game.addPlayer(new BasePlayer('123456'))
      removedPlayer = game.removePlayer('123456')
    })

    it('should remove a player from players collection on the game', () => {
      expect(game.players.has('123456')).toBe(false)
    })

    it('should return true if it removes the player', () => {
      expect(removedPlayer).toBe(true)
    })

    it("should return false if it can't remove the player", () => {
      const removedPlayer = game.removePlayer('123456')
      expect(removedPlayer).toBe(false)
    })
  })

  describe('#getPlayer', () => {
    let player
    beforeEach(() => {
      game.addPlayer(new BasePlayer('123456'))
      player = game.getPlayer('123456')
    })

    afterEach(() => {
      game.players.delete('123456')
    })
    it('should get a player from the players collection', () => {
      expect(player).toBeInstanceOf(BasePlayer)
    })

    it("should return false if it can't get the player", () => {
      const player = game.getPlayer('1646546')
      expect(player).toBe(false)
    })
  })
})
