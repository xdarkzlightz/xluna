import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const ServerStatsSchema = new Schema({
  lastDayUpdated: {
    type: String,
    default: new Date().toUTCString()
  },
  joinedDay: {
    type: Number,
    default: 0
  },
  leftDay: {
    type: Number,
    default: 0
  },
  lastWeekUpdated: {
    type: String,
    default: new Date().toUTCString()
  },
  joinedWeek: {
    type: Number,
    default: 0
  },
  leftWeek: {
    type: Number,
    default: 0
  },
  lastMonthUpdated: {
    type: String,
    default: new Date().toUTCString()
  },
  joinedMonth: {
    type: Number,
    default: 0
  },
  leftMonth: {
    type: Number,
    default: 0
  }
})

export default ServerStatsSchema
