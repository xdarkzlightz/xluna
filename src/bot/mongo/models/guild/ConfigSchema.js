import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const ConfigSchema = new Schema({
  prefix: String,
  rating: Number
})

export default ConfigSchema
