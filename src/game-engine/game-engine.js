const { Collection } = require('discord.js')
const EventEmitter = require('events')
/**
 * This module is responsible for managing games
 */
class GameEngine extends EventEmitter {
  constructor () {
    super()

    this.games = new Collection()
    this.gamestorage = new Collection()
  }

  /**
   * Lets you register a game to the engine
   * @param  {string} name      The name of the game you're registering, will be mapped to the collection using this name
   * @param  {game object} game This is the object containing the methods and everything needed for the actual game
   */
  registerGame (name, game) {
    if (this.games.has(name)) {
      return this.emit(
        'GameEngine-debug',
        `Game: ${name} has already been registered to the engine!`
      )
    }

    this.games.set(name, game)

    return this.emit(
      'GameEngine-debug',
      `Game: ${name} has been registered to the engine`
    )
  }

  /**
   * Creates a new game and adds it to the game storage
   * @param  {name}     name      The type of game you want to create
   * @param  {settings} settings  What settings the new game should have
   * @return {Boolean}            If a game was able to be created
   */
  newGame (name, settings) {
    if (!this.games.has(name)) {
      return this.emit('GameEngine-debug', `Game: ${name} isn't registered!`)
    }

    const Game = this.games.get(name)

    const newGame = new Game({ gameEngine: this, ...settings })

    newGame.addPlayer(settings.owner)

    if (this.gamestorage.has(newGame.id)) {
      this.emit(
        'GameEngine-debug',
        `A game with the id of: ${newGame.id} is already registered!`
      )

      return false
    }

    this.gamestorage.set(newGame.id, newGame)

    this.emit(
      'GameEngine-debug',
      `Game Session: ${newGame.id} has been created`
    )

    return true
  }

  getGame (id) {
    if (!this.gamestorage.has(id)) {
      this.emit('GameEngine-debug', `Game Session: ${id} does not exist`)
      return false
    }

    const game = this.gamestorage.get(id)
    this.emit('GameEngine-debug', `Got Game Session: ${id} from game storage`)
    return game
  }

  removeGame (id) {
    if (!this.gamestorage.has(id)) {
      this.emit('GameEngine-debug', `Game Session: ${id} does not exist`)
      return false
    }

    this.gamestorage.delete(id)
    this.emit(
      'GameEngine-debug',
      `Removed Game Session: ${id} from game storage`
    )
    return true
  }
}

module.exports = GameEngine
