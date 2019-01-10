const { Collection } = require('discord.js')

/*
TODO: Make the addPlayer method respect the maxPlayers setting
TODO: re-do error handling, to be specific make it return an object
*/

/**
 * This is the base game object, all game related types extend this class
 */
class Game {
  constructor ({ maxPlayers, id, owner, gameEngine }) {
    // The games players,
    this.players = new Collection()

    // Properties that don't change goes here
    this.id = id
    this.gameEngine = gameEngine

    // Any properties that change the game get added to the settings object
    this.settings = {
      owner,
      maxPlayers
    }

    // Anything that modifies the state of the game gets added to the state object
    this.state = {
      started: false
    }
  }

  // Starts the game
  start () {
    this.gameEngine.emit(
      'GameEngine-debug',
      `Starting Game Session: ${this.id}`
    )

    if (this.players.array().length <= 1) {
      this.gameEngine.emit(
        'GameEngine-debug',
        `Could not start Game Session: ${this.id}, only one player`
      )
      return false
    }

    this.randomizePlayers()

    this.state.currentPlayer = this.players.array()[0]

    this.gameEngine.emit('GameEngine-debug', `Game Session: ${this.id} started`)
    this.state.started = true

    return true
  }

  // Sets state.currentPlayer to be the next player in the players array
  nextTurn () {
    const pos = this.players.array().indexOf(this.state.currentPlayer)
    this.state.currentPlayer =
      this.players.array()[pos + 1] === undefined
        ? this.players.array()[0]
        : this.players.array()[pos + 1]

    if (this.state.currentTurnTimout) clearTimeout(this.state.currentTurnTimout)
  }

  getNextTurn () {
    const pos = this.players.array().indexOf(this.state.currentPlayer)
    return this.players.array()[pos + 1] === undefined
      ? this.players.array()[0]
      : this.players.array()[pos + 1]
  }

  // Ends the game
  end () {
    this.gameEngine.emit('GameEngine-debug', `Ending Game Session: ${this.id}`)

    this.state.currentPlayer = undefined

    this.gameEngine.emit('GameEngine-debug', `Game Session: ${this.id} ended`)
    this.state.started = false

    return true
  }

  // Adds a player to the game
  addPlayer (player) {
    if (this.players.has(player.id)) {
      this.gameEngine.emit(
        'GameEngine-debug',
        `Could not add player to Game Session: ${this.id}`
      )

      return false
    }

    this.players.set(player.id, player)

    this.gameEngine.emit(
      'GameEngine-debug',
      `Player: ${player.id} added to Game Session: ${this.id}`
    )

    return true
  }

  // Removes a player from the game
  removePlayer (id) {
    if (!this.players.has(id)) {
      this.gameEngine.emit(
        'GameEngine-debug',
        `Could not remove Player: ${id} from Game Session: ${this.id}`
      )

      return false
    }

    this.players.delete(id)

    this.gameEngine.emit(
      'GameEngine-debug',
      `Player: ${id} removed from Game Session: ${this.id}`
    )

    return true
  }

  // Gets a player from the game
  getPlayer (id) {
    if (!this.players.has(id)) {
      this.gameEngine.emit(
        'GameEngine-debug',
        `Could not get Player: ${id} from Game Session: ${this.id}`
      )

      return false
    }

    const player = this.players.get(id)

    this.gameEngine.emit(
      'GameEngine-debug',
      `Got Player: ${id} from Game Session: ${this.id}`
    )

    return player
  }
  setGameOwner (id) {
    if (!this.players.has(id)) {
      this.gameEngine.emit(
        'GameEngine-debug',
        `Could not get Player: ${id} from Game Session: ${this.id}`
      )

      return false
    }
    this.settings.owner = id
    this.gameEngine.emit(
      'GameEngine-debug',
      `Changed game owner to: ${id} in Game Session: ${this.id}`
    )

    return true
  }

  // Randomizes the order of the players collection
  randomizePlayers () {
    this.gameEngine.emit(
      'GameEngine-debug',
      `Randomizing players collection for Game Session: ${this.id}`
    )

    const array = Array.from(this.players.values())
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)) // random index from 0 to i
      ;[array[i], array[j]] = [array[j], array[i]] // swap elements
    }

    this.players = new Collection()

    array.forEach(player => {
      this.players.set(player.id, player)
    })
  }
}

module.exports = Game
