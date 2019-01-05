const BaseGame = require('../../base-types/game')
/**
 * This is the card game object, all card related games extend this class
 */
class CardGame extends BaseGame {
  constructor (settings) {
    super(settings)

    const { startingHandLength } = settings
    // When a player plays a card, discard it here so it can go back into the draw pile when it's empty
    this.state.discardedCards = []

    // The games draw pile, this will get refreshed from the discarded cards array when it's empty
    this.state.drawPile = []

    this.settings.startingHandLength = startingHandLength
  }

  // Starts the card game and then calls the super function
  start (deck) {
    this.state.drawPile = deck
    this.randomizeDeck(this.state.drawPile)
    this.players.array().forEach(player => {
      this.addCardsToPlayer(player.id, this.settings.startingHandLength)
    })
    this.state.discardedCards.unshift(this.state.drawPile.shift())
    this.state.currentCard = this.state.discardedCards[0]
    const started = super.start()
    if (!started) {
      this.end()
      return false
    } else {
      return true
    }
  }

  end () {
    this.state.drawPile = []
    this.state.discardedCards = []
    this.players.array().forEach(player => {
      player.hand = []
    })

    this.state.currentCard = undefined
    return super.end()
  }

  play (id, card) {
    this.gameEngine.emit(
      'GameEngine-debug',
      `Playing card ${card.name}: ${card.type} in Game Session: ${this.id}`
    )
    const player = this.players.get(id)

    player.removeCards([card])

    this.state.discardedCards.push(card)

    this.state.currentCard = card

    this.nextTurn()
    return true
  }

  addCardsToPlayer (id, amount) {
    const player = this.players.get(id)

    let cards = []
    while (cards.length !== amount) {
      let card = this.state.drawPile.shift()
      if (!card) {
        this.refreshDrawPile()
        card = this.state.drawPile.shift()
      }
      cards.push(card)
    }
    player.addCards(cards)
    return cards
  }

  // Refreshes the draw pile with the cards from the discarded cards array
  refreshDrawPile () {
    let array = this.state.discardedCards

    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }

    array.forEach(card => {
      this.state.drawPile.push(card)
    })

    this.state.discardedCards = []
  }

  randomizeDeck (array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }

    return array
  }
}

module.exports = CardGame
