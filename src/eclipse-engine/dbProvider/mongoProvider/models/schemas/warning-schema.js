import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const WarningSchema = new Schema({
  reason: String,
  modID: String,
  timestamp: String
})

export default WarningSchema
