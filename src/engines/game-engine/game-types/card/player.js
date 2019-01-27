const BasePlayer = require('../../base-types/player')

/**
 * Player class for a card game, made to be extended to include different properties
 */
class Player extends BasePlayer {
  constructor (id) {
    super(id)
    this.hand = []
  }

  addCards (cards) {
    cards.forEach(card => {
      this.hand.push(card)
    })
  }

  removeCards (cards) {
    cards.forEach(card => {
      const c = this.hand.find(
        c => card.name === c.name && card.type === c.type
      )
      const pos = this.hand.indexOf(c)
      this.hand.splice(pos, 1)
    })
  }

  getCard ({ name, type }) {
    const card = this.hand.find(c => name === c.name && type === c.type)
    if (!card) {
      return false
    }
    return card
  }
}

module.exports = Player
