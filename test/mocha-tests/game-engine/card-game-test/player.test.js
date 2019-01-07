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
  describe('player-test', () => {
    describe('#addCards', () => {
      it('should add cards to the players hand', () => {
        game.addPlayer(new Player('123456'))
        game.addPlayer(new Player('654321'))

        const player = game.players.get('123456')
        player.addCards(deck.slice())
        expect(player.hand.length).toEqual(deck.length)
      })
    })

    describe('#removeCards', () => {
      it('should remove cards from the players hand', () => {
        game.addPlayer(new Player('123456'))
        game.addPlayer(new Player('654321'))

        const player = game.players.get('123456')
        player.addCards(deck.slice())
        player.removeCards([{ name: 'ace', type: 'spades' }])
        expect(player.hand.length).not.toEqual(deck.length)
      })
    })
  })
})
