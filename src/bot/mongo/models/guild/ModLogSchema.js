import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const ModLogSchema = new Schema({
  action: String,
  reason: String,
  modID: String,
  timestamp: String
})

export default ModLogSchema
