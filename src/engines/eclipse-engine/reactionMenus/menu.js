import { Collection } from 'discord.js'

export class Menu {
  constructor (message) {
    this.functions = new Collection()
    this.message = message
  }

  addFunc (emote, func) {
    this.functions.set(emote, func)
  }
}
