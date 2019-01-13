import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const TagSchema = new Schema({
  name: String,
  body: String
})

export default TagSchema
