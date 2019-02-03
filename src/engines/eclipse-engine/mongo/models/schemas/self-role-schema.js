import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const SelfRoleSchema = new Schema({
  role: String,
  emote: String
})

export default SelfRoleSchema
