const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ConfigSchema = new Schema({
  prefix: String,
  rating: Number
})

module.exports = ConfigSchema
