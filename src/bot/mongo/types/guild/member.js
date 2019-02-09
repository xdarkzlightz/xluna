import Base from './base'

class mongoMember extends Base {
  constructor (member, guild) {
    super(member, guild)

    this.nickname = member.nickname
    this.warnings = member.warnings
    this.modlogs = member.modLogs
    this.exp = member.exp
    this.level = member.level
  }

  /** Shortcut to remove this member */
  remove () {
    this.guild.remove('member', this.data.id)
  }
}

export default mongoMember
