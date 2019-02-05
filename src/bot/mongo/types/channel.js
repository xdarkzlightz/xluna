import Base from './base'

class mongoChannel extends Base {
  // eslint-disable-next-line no-useless-constructor
  constructor (channel, guild) {
    super(channel, guild)
  }

  /** Shortcut to remove this channel */
  remove () {
    this.guild.remove('channel', this.data.id)
  }
}

export default mongoChannel
