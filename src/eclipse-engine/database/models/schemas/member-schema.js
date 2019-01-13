import { Schema as _Schema } from 'mongoose'

import GroupSchema from './group-schema'
import WarningSchema from './warning-schema'
import LogSchema from './log-schema'

const Schema = _Schema

const MemberSchema = new Schema({
  id: String,
  groups: [GroupSchema],
  warnings: [WarningSchema],
  modLogs: [LogSchema]
})

export default MemberSchema
