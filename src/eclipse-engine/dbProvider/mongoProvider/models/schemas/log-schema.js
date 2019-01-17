import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const LogSchema = new Schema({
  action: String,
  reason: String,
  modID: String,
  timestamp: String
})

export default LogSchema
