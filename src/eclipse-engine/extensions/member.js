const Base = require('./base')

class EclipseMember extends Base {
  constructor (client, member) {
    super('member', client, member)

    this.client = client

    this.obj = member
  }
}

module.exports = EclipseMember
