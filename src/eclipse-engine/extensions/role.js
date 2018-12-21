const Base = require('./base')

class EclipseRole extends Base {
  constructor (client, role) {
    super('role', client, role)

    this.client = client

    this.role = role
  }
}

module.exports = EclipseRole
