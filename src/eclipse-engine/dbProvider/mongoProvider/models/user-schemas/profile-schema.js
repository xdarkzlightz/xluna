import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const ProfileSchema = new Schema({
  description: String,
  desc: String,
  exp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  marriedTo: {
    type: String,
    default: ''
  },
  marryRequests: [String]
})

export default ProfileSchema
