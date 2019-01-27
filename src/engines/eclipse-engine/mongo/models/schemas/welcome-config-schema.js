import { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const WelcomeConfigSchema = new Schema({
  channelID: String,
  body: String
})

export default WelcomeConfigSchema
