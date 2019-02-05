import { Schema as _Schema } from 'mongoose'
import WelcomeConfigSchema from './WelcomeConfigSchema'

const Schema = _Schema

const OnJoinSchema = new Schema({
  autorole: String,
  welcome: WelcomeConfigSchema
})

export default OnJoinSchema
