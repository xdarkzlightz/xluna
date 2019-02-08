import { Schema as _Schema } from 'mongoose'

import GroupSchema from './GroupSchema'

const Schema = _Schema

const ChannelSchema = new Schema({
  id: String,
  groups: [GroupSchema],
  expEnabled: {
    type: Boolean,
    default: true
  }
})

export default ChannelSchema
