import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const CommandSchema = new Schema({
  name: String,
  enabled: Boolean
})

export default CommandSchema
