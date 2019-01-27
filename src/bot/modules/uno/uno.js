import { Collection } from 'discord.js'

import CardGame from '@engines/game/game-types/card/game'
import Player from '@engines/game/game-types/card/player'

import { types, colours } from './util'
import UnoCard from './card'

/**
 * This module is responsible for managing games
 */
class Uno extends CardGame {
  constructor (settings) {
    super(settings)

    this.state.uno = []
    this.state.gracePeriod = new Collection()
    this.state.drawStack = 0
  }

  start () {
    if (!this.players.array().length) return
    const deck = this.createUnoDeck()
    const started = super.start(deck)
    const currentCard = this.state.currentCard

    if (!currentCard.name) {
      const colours = ['red', 'green', 'blue', 'yellow']
      currentCard.name = colours[Math.floor(Math.random() * 5)]
    }
    return started
  }

  play (id, { colour, type }) {
    const player = this.players.get(id)

    let card
    if (colour === 'wild' || colour === 'wild+4') {
      card = player.getCard({ name: undefined, type: colour })
    } else {
      card = player.getCard({ name: colour, type: type })
    }
    if (!card) {
      return {
        err: "you don't have the card you tried to play!"
      }
    }

    const currentCard = this.state.currentCard
    if (card.type === 'wild' || card.type === 'wild+4') {
      if (player.hand.length > 1 && this.state.uno.indexOf(id) !== -1) {
        const pos = this.state.uno.indexOf(id)
        this.state.uno.splice(pos, 1)
      }
      card.name = type
      let action
      if (card.type === 'wild+4') action = this.actionDraw(4)
      if (card.type !== 'wild+4') this.state.drawStack = 0
      if (currentCard.type === 'wild' || currentCard.type === 'wild+4') {
        currentCard.name = undefined
      }
      super.play(id, card)
      const winner = this.checkForWinner()
      if (!this.state.gracePeriod.has(player.id) && player.hand.length === 2) {
        this.state.gracePeriod.set(player.id, player)
        setTimeout(() => this.state.gracePeriod.delete(player.id), 8000)
      }

      if (winner) {
        return {
          winner: player.id
        }
      } else if (action) {
        return {
          action: action.name,
          target: action
        }
      } else {
        return true
      }
    } else if (
      card.name === currentCard.name ||
      card.type === currentCard.type
    ) {
      if (player.hand.length > 1 && this.state.uno.indexOf(id) !== -1) {
        const pos = this.state.uno.indexOf(id)
        this.state.uno.splice(pos, 1)
      }
      if (card.type !== '+2') this.state.drawStack = 0
      const action = this.doAction(card)
      if (currentCard.type === 'wild' || currentCard.type === 'wild+4') {
        currentCard.name = undefined
      }
      super.play(id, card)
      const winner = this.checkForWinner()

      if (!this.state.gracePeriod.has(player.id) && player.hand.length === 2) {
        this.state.gracePeriod.set(player.id, player)
        setTimeout(() => this.state.gracePeriod.delete(player.id), 8000)
      }

      if (winner) {
        return {
          winner: player.id
        }
      } else if (action) {
        return {
          action: action.name,
          target: action
        }
      } else {
        return true
      }
    } else {
      return {
        err: "card doesn't match!"
      }
    }
  }

  end () {
    this.state.uno = []
    return super.end()
  }

  uno (id) {
    const player = this.players.get(id)
    if (this.state.uno.indexOf(player.id) !== -1) return
    if (player.hand.length === 1) {
      this.state.uno.push(id)
      return true
    } else {
      return false
    }
  }

  callout () {
    const player = this.players.find(player => {
      return (
        player.hand.length === 1 && this.state.uno.indexOf(player.id) === -1
      )
    })
    if (!player) {
      return false
    } else {
      if (this.state.gracePeriod.has(player.id)) return false
      this.addCardsToPlayer(player.id, 2)
      return {
        player: player.id
      }
    }
  }

  doAction ({ colour, type }) {
    switch (type) {
      case 'skip':
        return this.actionSkip()
      case '+2':
        return this.actionDraw(2)
      case 'reverse':
        return this.actionReverse()
    }
  }

  actionSkip () {
    const player = Object.assign({}, this.getNextTurn())
    this.nextTurn()

    return {
      name: 'skip',
      player: player.id
    }
  }

  actionDraw (amount) {
    const player = this.getNextTurn()
    this.state.drawStack += amount
    const cards = this.addCardsToPlayer(player.id, this.state.drawStack)
    this.actionSkip()
    return {
      name: 'draw',
      player: player.id,
      cards
    }
  }

  actionReverse () {
    const player = this.getNextTurn()
    const playersArr = this.players.array().slice()
    const targetPlayer = playersArr.indexOf(player)
    this.players.array().reverse()

    if (
      this.state.currentPlayer.id !== targetPlayer.id &&
      this.players.array().length < 3
    ) {
      this.actionSkip()
    }

    return {
      name: 'reverse'
    }
  }

  addPlayer (id) {
    const player = new Player(id)
    return super.addPlayer(player)
  }

  checkForWinner () {
    let zero
    this.players.forEach(player => {
      if (zero) return
      if (player.hand.length === 0) {
        zero = player.id
      }
    })

    return zero
  }

  checkForUno () {
    let uno
    this.players.forEach(player => {
      if (uno) return
      if (player.hand.length === 1) {
        uno = player.id
      }
    })

    return uno
  }

  // Borrowed from: https://github.com/danguilherme/uno/blob/master/src/deck.ts
  createUnoDeck () {
    /*
    108 cards
    76x numbers (0-9, all colors)
    8x draw two (2x each color)
    8x reverse (2x each color)
    8x skip (2x each color)
    4x wild
    4x wild draw four
  */

    let deck = []

    const createCards = (qty, value, colour) => {
      const cards = []

      for (let i = 0; i < qty; i++) cards.push(new UnoCard(colour, value))

      return cards
    }
    // for each colour...
    for (let colour = 1; colour <= 4; colour++) {
      // CREATE NUMBERS
      deck.push.apply(deck, createCards(1, types['0'], colours[colour]))
      for (let n = 1; n <= 9; n++) {
        deck.push.apply(deck, createCards(2, n.toString(), colours[colour]))
      }

      deck.push.apply(deck, createCards(2, types['+2'], colours[colour]))
      deck.push.apply(deck, createCards(2, types.skip, colours[colour]))
      deck.push.apply(deck, createCards(2, types.reverse, colours[colour]))
    }

    deck.push.apply(deck, createCards(4, types.wild))
    deck.push.apply(deck, createCards(4, types['wild+4']))

    return deck
  }
}

module.exports = Uno
