import { error, success } from '@engines/eclipse/util/embed'

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

  init () {
    this.logger.debug('[CTX]: Getting guild from collection')
    this.db = this.client.db
    this.guild.db = this.client.db.guilds.get(this.guild.id)
    this.author.db = this.client.db.users.get(this.author.id)
    this.everyone = this.guild.roles.get(this.guild.id)

    if (this.guild.db) {
      this.prefix = this.guild.db.config.prefix
    } else {
      this.prefix = this.client.prefix
    }
  }

  say (msg) {
    try {
      return this.channel.send(msg)
    } catch (e) {}
  }

  error (msg, settings) {
    this.say(error(msg, settings))
  }

  success (msg) {
    this.say(success(msg))
  }
}

export default CTX
