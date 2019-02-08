import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const LeaveConfigSchema = new Schema({
  channelID: String,
  body: String
})

export default LeaveConfigSchema
