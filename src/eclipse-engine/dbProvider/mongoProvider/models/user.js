import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const UserSchema = new Schema({
  id: String,
  exp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  }
})

const User = model('user', UserSchema)

export default User
