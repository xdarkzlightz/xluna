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
    this.member.db = this.guild.db.members.get(this.member.id)
    this.channel.db = this.guild.db.channels.get(this.channel.id)
    this.everyone = this.guild.roles.get(this.guild.id)
    this.everyone.db = this.guild.db.roles.get(this.guild.id)

    this.prefix = this.guild.db.config.prefix

    if (!this.member.db && !this.author.bot) {
      this.member.db = this.guild.db.add('member', { id: this.member.id })
    }

    if (!this.channel.db) {
      this.channel.db = this.guild.db.add('channel', { id: this.channel.id })
    }

    if (!this.author.db && !this.author.bot) {
      this.author.db = this.db.newUser(this.author.id)
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
