import { Schema as _Schema } from 'mongoose'

import TagSchema from './tag-schema'
import LoggerConfigSchema from './logger-config-schema'
import WelcomeConfigSchema from './welcome-config-schema'
import LeaveConfigSchema from './leave-config-schema'

const Schema = _Schema

const ConfigSchema = new Schema({
  prefix: String,
  rating: Number,
  roleID: String,
  tags: [TagSchema],
  logger: LoggerConfigSchema,
  welcome: WelcomeConfigSchema,
  leave: LeaveConfigSchema
})

export default ConfigSchema
