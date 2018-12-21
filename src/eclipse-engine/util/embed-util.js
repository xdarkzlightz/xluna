const { RichEmbed } = require('discord.js')

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
module.exports.colours = colours
module.exports.images = images

/**
 * Embeds an success message
 * @param  {String} message The message you want to embed
 * @return {discord.js embed}         Embedded message
 */
module.exports.success = message => {
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
module.exports.error = ({ type, message, values }) => {
  const embed = new RichEmbed()
    .setAuthor(type || 'Error!', images.x)
    .setColor(colours.error)
  if (type === 'Missing argument') {
    embed.setDescription(message)
  } else if (type === 'Invalid argument ') {
    embed.setDescription(message)
  } else if (type === 'Invalid user ') {
    embed.setDescription(message)
  } else if (type === 'Invalid argument value') {
    embed.setDescription(message)
    embed.addField('Valid options', values.join(', '))
  } else {
    embed.setDescription(message)
  }
  return embed
}

module.exports.colours = colours
