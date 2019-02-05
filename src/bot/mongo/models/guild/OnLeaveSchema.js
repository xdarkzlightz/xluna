import { Schema as _Schema } from 'mongoose'
import LeaveConfigSchema from './LeaveConfigSchema'

const Schema = _Schema

const OnLeaveSchema = new Schema({
  leave: LeaveConfigSchema
})

export default OnLeaveSchema
