import { Schema as _Schema } from 'mongoose'

import GroupSchema from './group-schema'

const Schema = _Schema

const MemberSchema = new Schema({
  id: String,
  groups: [GroupSchema]
})

export default MemberSchema
