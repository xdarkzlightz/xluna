import Base from './base'

class mongoRole extends Base {
  // eslint-disable-next-line no-useless-constructor
  constructor (role, guild) {
    super(role, guild)
  }

  /** Shortcut to remove this role */
  remove () {
    this.guild.remove('role', this.data.id)
  }
}

export default mongoRole
