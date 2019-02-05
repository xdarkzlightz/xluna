import { Schema as _Schema } from 'mongoose'

import GroupSchema from './group-schema'
import WarningSchema from './warning-schema'
import LogSchema from './log-schema'

const Schema = _Schema

const MemberSchema = new Schema({
  id: String,
  nickname: String,
  groups: [GroupSchema],
  warnings: [WarningSchema],
  modLogs: [LogSchema],
  exp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  }
})

export default MemberSchema
