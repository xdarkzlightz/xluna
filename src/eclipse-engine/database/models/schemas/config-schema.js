import { Schema as _Schema } from 'mongoose'

import TagSchema from './tag-schema'
import LoggerConfigSchema from './logger-config-schema'

const Schema = _Schema

const ConfigSchema = new Schema({
  prefix: String,
  rating: Number,
  tags: [TagSchema],
  logger: LoggerConfigSchema
})

export default ConfigSchema
