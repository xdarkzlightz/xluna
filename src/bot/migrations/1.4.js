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
    if (!c.data.expEnabled) c.data.expEnabled = true
  })

  db.members.forEach(m => {
    if (!m.data.nickname) m.data.nickname = ''
    if (!m.data.warnings) m.data.warnings = []
    if (!m.data.modLogs) m.data.modLogs = []
    if (!m.data.exp) m.data.exp = 0
    if (!m.data.level) m.data.level = 1
  })

  data.roles.forEach(r => {
    if (!r.data.mod) r.data.mod = false
  })
}
