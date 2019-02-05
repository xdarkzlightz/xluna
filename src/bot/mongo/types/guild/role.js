import Base from './base'

class mongoRole extends Base {
  constructor (role, guild) {
    super(role, guild)
    this.mod = role.mod
  }

  /** Shortcut to remove this role */
  remove () {
    this.guild.remove('role', this.data.id)
  }
}

export default mongoRole
