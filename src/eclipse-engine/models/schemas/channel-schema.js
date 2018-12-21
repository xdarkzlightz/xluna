const mongoose = require('mongoose')

const GroupSchema = require('./group-schema')

const Schema = mongoose.Schema

const ChannelSchema = new Schema({
  id: String,
  groups: [GroupSchema]
})

module.exports = ChannelSchema
