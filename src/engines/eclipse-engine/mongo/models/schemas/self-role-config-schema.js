import { Schema as _Schema } from 'mongoose'
import SelfRoleSchema from './self-role-schema'

const Schema = _Schema

const SelfRoleConfigSchema = new Schema({
  roles: [SelfRoleSchema],
  message: String,
  channel: String
})

export default SelfRoleConfigSchema
