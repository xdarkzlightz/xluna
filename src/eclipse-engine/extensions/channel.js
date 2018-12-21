const Base = require('./base')

class EclipseChannel extends Base {
  constructor (client, channel) {
    super('channel', client, channel)

    this.client = client

    this.channel = channel
  }
}

module.exports = EclipseChannel
