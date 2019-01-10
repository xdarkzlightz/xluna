/**
 * Base player class, made to be extended to include different properties
 */
class Player {
  constructor (id) {
    this.id = id
    this.strikes = 0
  }
}

module.exports = Player
