import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const LoggerConfigSchema = new Schema({
  channelID: String,
  channelCreate: Boolean,
  channelUpdate: Boolean,
  channelDelete: Boolean,
  roleCreate: Boolean,
  roleUpdate: Boolean,
  roleDelete: Boolean,
  messageDelete: Boolean,
  messageUpdate: Boolean,
  memberUpdate: Boolean,
  serverUpdate: Boolean,
  join: Boolean,
  leave: Boolean
})

export default LoggerConfigSchema
