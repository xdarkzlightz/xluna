const expect = require('expect')

const GameEngine = require('../../../../src/game-engine/game-engine')
const CardGame = require('../../../../src/game-engine/game-types/card/game')
const BaseCard = require('../../../../src/game-engine/game-types/card/card')
const Player = require('../../../../src/game-engine/game-types/card/player')

let gameEngine
before(() => {
  gameEngine = new GameEngine()
  gameEngine.registerGame('TestGame', CardGame)
})

const deck = [
  new BaseCard('ace', 'spades'),
  new BaseCard('2', 'spades'),
  new BaseCard('3', 'spades'),
  new BaseCard('4', 'spades'),
  new BaseCard('5', 'spades'),
  new BaseCard('6', 'spades'),
  new BaseCard('7', 'spades'),
  new BaseCard('8', 'spades'),
  new BaseCard('9', 'spades'),
  new BaseCard('10', 'spades'),
  new BaseCard('jack', 'spades'),
  new BaseCard('queen', 'spades'),
  new BaseCard('king', 'spades'),
  new BaseCard('ace', 'clubs'),
  new BaseCard('2', 'clubs'),
  new BaseCard('3', 'clubs'),
  new BaseCard('4', 'clubs'),
  new BaseCard('5', 'clubs'),
  new BaseCard('6', 'clubs'),
  new BaseCard('7', 'clubs'),
  new BaseCard('8', 'clubs'),
  new BaseCard('9', 'clubs'),
  new BaseCard('10', 'clubs'),
  new BaseCard('jack', 'clubs'),
  new BaseCard('queen', 'clubs'),
  new BaseCard('king', 'clubs')
]

describe('card-game', () => {
  let game
  beforeEach(() => {
    gameEngine.newGame('TestGame', {
      maxPlayers: 10,
      id: '123',
      startingHandLength: 7
    })

    game = gameEngine.gamestorage.get('123')
  })

  afterEach(() => {
    gameEngine.gamestorage.delete('123')
  })
  describe('#start', () => {
    it('should return true', () => {
      game.addPlayer(new Player('123456'))
      game.addPlayer(new Player('654321'))

      const gameStarted = game.start(deck.slice())

      expect(gameStarted).toBe(true)
    })
    it('should set the starting card', () => {
      game.addPlayer(new Player('123456'))
      game.addPlayer(new Player('654321'))

      game.start(deck.slice())

      expect(game.state.currentCard).toBeInstanceOf(BaseCard)
    })

    it('should set the draw pile', () => {
      game.addPlayer(new Player('123456'))
      game.addPlayer(new Player('654321'))

      game.start(deck.slice())
      expect(game.state.drawPile).not.toEqual([])
    })

    it('should set the players hands', () => {
      game.addPlayer(new Player('123456'))
      game.addPlayer(new Player('654321'))

      game.start(deck.slice())

      const player = game.players.get('123456')
      expect(player.hand.length).toEqual(7)
    })
  })

  describe('#refreshDrawPile', () => {
    it('should refresh the draw pile', () => {
      game.addPlayer(new Player('123456'))
      game.addPlayer(new Player('654321'))

      game.start(deck.slice())

      game.addCardsToPlayer('123456', 11)
      const player = game.players.get('123456')
      const hand = player.hand.slice()
      hand.forEach(card => {
        game.play(player.id, card)
      })
      game.addCardsToPlayer('123456', 3)

      expect(game.state.drawPile).not.toEqual([])
    })
  })

  describe('#play', () => {
    it('should add to the discarded pile', () => {
      game.addPlayer(new Player('123456'))
      game.addPlayer(new Player('654321'))

      game.start(deck.slice())

      game.play('123456', { name: 'ace', type: 'spades' })
      expect(game.state.discardedCards).not.toEqual([])
    })
  })
})
