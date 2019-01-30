import { Collection } from 'discord.js'
import { Menu } from './menu'

export class ReactionMenuManager {
  constructor () {
    this.menus = new Collection()
  }

  addMenu (message, time) {
    this.menus.set(message.id, new Menu(message))

    if (time) {
      setTimeout(() => {
        this.removeMenu(message.id)
      }, time)
    }

    return this.getMenu(message.id)
  }

  removeMenu (id) {
    this.menus.delete(id)
  }

  getMenu (id) {
    return this.menus.get(id)
  }
}
