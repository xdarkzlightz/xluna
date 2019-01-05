import { Guild } from '@eclipse/database'
import { error, success } from '@eclipse/util/embed'

class CTX {
  constructor (message, client) {
    this.client = client

    this.msg = message

    this.channel = message.channel
    this.guild = message.guild

    this.author = message.author
    this.member = message.member

    this.logger = client.logger
    this.logger.debug(`[CTX]: Created CTX for ${message.id}`)
  }

  async init () {
    this.logger.debug('[CTX]: Getting guild from collection')
    this.db = await Guild.findOne({ id: this.guild.id })

    if (this.db) {
      this.prefix = this.db.config.prefix
    } else {
      this.prefix = this.client.prefix
    }
  }

  say (msg) {
    this.channel.send(msg)
  }

  error (msg, settings) {
    this.say(error(msg, settings))
  }

  success (msg) {
    this.say(success(msg))
  }
}

export default CTX
