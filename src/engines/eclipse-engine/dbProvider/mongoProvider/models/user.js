import { Schema as _Schema, model } from 'mongoose'
import ProfileSchema from './user-schemas/profile-schema'

const Schema = _Schema

const UserSchema = new Schema({
  id: String,
  profile: ProfileSchema
})

const User = model('user', UserSchema)

export default User
