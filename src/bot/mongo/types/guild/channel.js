import Base from './base'

class mongoChannel extends Base {
  constructor (channel, guild) {
    super(channel, guild)
    this.expEnabled = channel.expEnabled
  }

  /** Shortcut to remove this channel */
  remove () {
    this.guild.remove('channel', this.data.id)
  }
}

export default mongoChannel
