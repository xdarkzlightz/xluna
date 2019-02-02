export default function migrate (db) {
  const data = db

  if (!data.config.roleID) data.config.roleID = ''
  if (!data.config.tags) data.config.tags = []
  if (!data.config.logger) {
    data.config.logger = {
      channelID: '',
      channelCreate: false,
      channelUpdate: false,
      channelDelete: false,
      roleCreate: false,
      roleUpdate: false,
      roleDelete: false,
      messageDelete: false,
      messageUpdate: false,
      memberUpdate: false,
      serverUpdate: false,
      join: false,
      leave: false
    }
  }
  if (!data.config.welcome) data.config.welcome = { channelID: '', body: '' }

  if (!data.config.leave) data.config.leave = { channelID: '', body: '' }

  db.channels.forEach(c => {
    if (!c.expEnabled) c.expEnabled = true
  })

  db.members.forEach(m => {
    if (!m.nickname) m.nickname = ''
    if (!m.warnings) m.warnings = []
    if (!m.modLogs) m.modLogs = []
    if (!m.exp) m.exp = 0
    if (!m.level) m.level = 1
  })

  db.roles.forEach(r => {
    if (!r.mod) r.mod = false
  })
}
