const mongoose = require('mongoose')

const CommandSchema = require('./command-schema')

const Schema = mongoose.Schema

const GroupSchema = new Schema({
  name: String,
  commands: [CommandSchema]
})

module.exports = GroupSchema
