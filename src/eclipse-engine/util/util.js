const embed = require('./embed-util')
// Logging
module.exports.log = (event, msg) => {
  console.log(`[${event}]: ${msg}`)
}

// Re-exports the embed module
module.exports.embed = embed

// Asynchronus for each
module.exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

// Removes an item from an array passed through
module.exports.removeFromArray = (array, item) => {
  const index = array.indexOf(item)
  if (index > -1) {
    array.splice(index, 1)
  }
  return array
}

// Guild ratings
module.exports.ratings = {
  PG: 0,
  PG13: 1,
  NSFW: 2
}

// find function for when comparing a value with a name property vs a value

module.exports.findName = (val, val2) => {
  const value = val.find(obj => {
    return obj.name === val2
  })
  return value
}

// find function for when comparing a value with a id property vs a value
module.exports.findID = (val, val2) => {
  const value = val.find(obj => {
    return obj.id === val2
  })
  return value
}

// Function for creating an array of group objects
module.exports.createGroups = (collection, rating) => {
  let groups = []
  collection.array().forEach(group => {
    groups.push(group.createSchema(rating))
  })

  return groups
}
