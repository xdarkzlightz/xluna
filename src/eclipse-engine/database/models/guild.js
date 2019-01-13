import { Schema as _Schema, model } from 'mongoose'

import ConfigSchema from './schemas/config-schema'
import ChannelSchema from './schemas/channel-schema'
import MemberSchema from './schemas/member-schema'
import RoleSchema from './schemas/role-schema'

const Schema = _Schema

const GuildSchema = new Schema({
  id: String,
  config: ConfigSchema,
  channels: [ChannelSchema],
  roles: [RoleSchema],
  members: [MemberSchema]
})

const Guild = model('guild', GuildSchema)

export default Guild
