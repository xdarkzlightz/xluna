import { Schema as _Schema } from 'mongoose'

import TagSchema from './tag-schema'

const Schema = _Schema

const ConfigSchema = new Schema({
  prefix: String,
  rating: Number,
  tags: [TagSchema]
})

export default ConfigSchema
