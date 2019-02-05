import { Schema as _Schema } from 'mongoose'

import CommandSchema from './CommandSchema'

const Schema = _Schema

const GroupSchema = new Schema({
  name: String,
  commands: [CommandSchema]
})

export default GroupSchema
