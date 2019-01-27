// Asynchronus for each
export async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

// Removes an item from an array passed through
export function removeFromArray (array, item) {
  const index = array.indexOf(item)
  if (index > -1) {
    array.splice(index, 1)
  }
  return array
}

// find function for when comparing a value with a name property vs a value

export function findName (array, name) {
  const value = array.find(obj => {
    return obj.name === name
  })
  return value
}

// find function for when comparing a value with a id property vs a value
export function findID (array, id) {
  const value = array.find(obj => {
    return obj.id === id
  })
  return value
}
