const mongoose = require('mongoose')

const ConfigSchema = require('./schemas/config-schema')
const ChannelSchema = require('./schemas/channel-schema')
const MemberSchema = require('./schemas/member-schema')
const RoleSchema = require('./schemas/role-schema')

const Schema = mongoose.Schema

const GuildSchema = new Schema({
  id: String,
  config: ConfigSchema,
  channels: [ChannelSchema],
  roles: [MemberSchema],
  members: [RoleSchema]
})

const Guild = mongoose.model('guild', GuildSchema)

module.exports = Guild
