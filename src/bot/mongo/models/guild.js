import { Schema as _Schema, model } from 'mongoose'

import ConfigSchema from './guild/config-schema'
import ChannelSchema from './guild/channel-schema'
import MemberSchema from './guild/member-schema'
import RoleSchema from './guild/role-schema'
import SelfRoleConfigSchema from './guild/self-role-config-schema'

const Schema = _Schema

const GuildSchema = new Schema({
  id: String,
  config: ConfigSchema,
  channels: [ChannelSchema],
  roles: [RoleSchema],
  members: [MemberSchema],
  selfroles: SelfRoleConfigSchema
})

const Guild = model('guild', GuildSchema)

export default Guild
