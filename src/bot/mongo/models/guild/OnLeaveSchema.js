import { Schema as _Schema } from 'mongoose'
import LeaveConfigSchema from './LeaveSchema'

const Schema = _Schema

const OnLeaveSchema = new Schema({
  leave: LeaveConfigSchema
})

export default OnLeaveSchema
