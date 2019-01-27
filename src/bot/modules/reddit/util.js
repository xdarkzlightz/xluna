export function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomElement (arr) {
  return arr[randomInt(0, arr.length)]
}
