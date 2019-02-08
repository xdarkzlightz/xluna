import { Schema as _Schema, model } from 'mongoose'

import ConfigSchema from './guild/ConfigSchema'
import ChannelSchema from './guild/ChannelSchema'
import MemberSchema from './guild/MemberSchema'
import RoleSchema from './guild/RoleSchema'
import SelfRoleConfigSchema from './guild/SelfRoleConfigSchema'
import TagSchema from './guild/TagSchema'
import LoggerConfigSchema from './guild/LogConfigSchema'
import OnJoinSchema from './guild/OnJoinSchema'
import OnLeaveSchema from './guild/OnLeaveSchema'
import ServerStatsSchema from './guild/ServerStatsSchema'

const Schema = _Schema

const GuildSchema = new Schema({
  id: String,
  config: ConfigSchema,
  selfroles: SelfRoleConfigSchema,
  tags: [TagSchema],
  logger: LoggerConfigSchema,
  onLeave: OnLeaveSchema,
  onJoin: OnJoinSchema,
  channels: [ChannelSchema],
  roles: [RoleSchema],
  members: [MemberSchema],
  serverstats: ServerStatsSchema
})

const Guild = model('guild', GuildSchema)

export default Guild
