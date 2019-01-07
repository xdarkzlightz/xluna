const CardGame = require('../../../src/game-engine/game-types/card/game')

/**
 * This is a test card game to test out the functionality of game-engine
 */
class testGame extends CardGame {
  constructor (settings) {
    super(settings)
    // used to get rid of eslint useless constructor
    this.oof = 'oof'
  }
}

module.exports = testGame
