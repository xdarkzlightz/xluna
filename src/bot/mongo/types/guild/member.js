import Base from './base'

class mongoMember extends Base {
  // eslint-disable-next-line no-useless-constructor
  constructor (member, guild) {
    super(member, guild)
  }

  /** Shortcut to remove this member */
  remove () {
    this.guild.remove('member', this.data.id)
  }
}

export default mongoMember
