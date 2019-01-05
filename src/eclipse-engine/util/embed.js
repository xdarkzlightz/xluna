import { RichEmbed } from 'discord.js'

// Select colours that get used often
const colours = {
  success: 0x57e69,
  error: 0xdb435d
}

// Images that get used often
const images = {
  checkmark:
    'https://image.ibb.co/ioKmvz/kisspng-check-mark-tick-clip-art-tick-5aac0430469033-9237016715212227042891.png',
  x:
    'https://image.ibb.co/bvNgAz/kisspng-computer-icons-free-content-clip-art-red-x-png-5ab1910a3f3a03-969308161521586442259.png'
}

// Export colours and images
const _colours = colours
export { _colours as colours }
const _images = images
export { _images as images }

/**
 * Embeds an success message
 * @param  {String} message The message you want to embed
 * @return {discord.js embed}         Embedded message
 */
export function success (message) {
  const embed = new RichEmbed()
    .setAuthor(message, images.checkmark)
    .setColor(colours.success)
  return embed
}

/**
 * Embeds an error message
 * @param  {String}           type     The type of message you want to embed
 * @param  {String}           message  The message you want to embed
 * @param  {Array}            values   An array of values that are used as options
 * @return {discord.js Embeds}         Discord.js embed object
 */
export function error (msg, settings = {}) {
  const embed = new RichEmbed().setAuthor(msg, images.x).setColor(colours.error)

  if (settings.defaults) {
    embed.addField('Valid options', settings.defaults.join(' '))
  }

  return embed
}
