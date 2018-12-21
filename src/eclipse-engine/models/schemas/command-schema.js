const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommandSchema = new Schema({
  name: String,
  enabled: Boolean
})

module.exports = CommandSchema
