export default function migrate (db) {
  if (!db.selfroles) db.selfroles = { roles: [] }

  if (!db.serverstats) db.serverstats = {}

  if (!db.tags) {
    db.tags = db.config.tags
    delete db.config.tags
  }

  if (!db.logger) {
    db.logger = db.config.logger
    delete db.config.logger
  }

  if (!db.onLeave) {
    db.onLeave = { leave: db.config.leave }
    delete db.config.leave
  }

  if (!db.onJoin) {
    db.onJoin = {
      autorole: db.config.roleID,
      welcome: db.config.welcome
    }

    delete db.config.welcome
    delete db.config.roleID
  }
}
