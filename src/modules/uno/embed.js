import { asyncForEach } from '@eclipse/util/array'
const { RichEmbed } = require('discord.js')

const colours = {
  success: 0x57e69,
  error: 0xdb435d,
  red: 0xff0000,
  green: 0x26ff00,
  blue: 0x0004ff,
  yellow: 0xe9ff00
}

// Images that get used often
const images = {
  checkmark:
    'https://image.ibb.co/ioKmvz/kisspng-check-mark-tick-clip-art-tick-5aac0430469033-9237016715212227042891.png',
  x:
    'https://image.ibb.co/bvNgAz/kisspng-computer-icons-free-content-clip-art-red-x-png-5ab1910a3f3a03-969308161521586442259.png',
  cards: {
    red: {
      '0': 'https://image.ibb.co/gnmtB8/red_0.png',
      '1': 'https://image.ibb.co/hvRFPT/red_1.png',
      '2': 'https://image.ibb.co/f9xN4T/red_2.png',
      '3': 'https://image.ibb.co/hDB4Jo/red_3.png',
      '4': 'https://image.ibb.co/m5RFPT/red_4.png',
      '5': 'https://image.ibb.co/bSVLr8/red_5.png',
      '6': 'https://image.ibb.co/dkRFPT/red_6.png',
      '7': 'https://image.ibb.co/grPfr8/red_7.png',
      '8': 'https://image.ibb.co/jxM4Jo/red_8.png',
      '9': 'https://image.ibb.co/j6vydo/red_9.png',
      skip: 'https://image.ibb.co/cHBDTo/red_skip.png',
      reverse: 'https://image.ibb.co/mdoGg8/red_reverse.png',
      '+2': 'https://image.ibb.co/hORDTo/red_2.png',
      wild: 'https://image.ibb.co/dPStdz/wild.png',
      'wild+4': 'https://image.ibb.co/jKctdz/wild_4.png'
    },
    green: {
      '0': 'https://image.ibb.co/gXUS4T/green_0.png',
      '1': 'https://image.ibb.co/iDZGyo/green_1.png',
      '2': 'https://image.ibb.co/f1RUJo/green_2.png',
      '3': 'https://image.ibb.co/h6fBW8/green_3.png',
      '4': 'https://image.ibb.co/mE8byo/green_4.png',
      '5': 'https://image.ibb.co/fgOn4T/green_5.png',
      '6': 'https://image.ibb.co/iAU5r8/green_7.png',
      '7': 'https://image.ibb.co/naituT/green_7.png',
      '8': 'https://image.ibb.co/fyMJB8/green_8.png',
      '9': 'https://image.ibb.co/iqjido/green_9.png',
      skip: 'https://image.ibb.co/btj6g8/green_skip.png',
      reverse: 'https://image.ibb.co/jDeTuT/green_reverse.png',
      '+2': 'https://image.ibb.co/b0gmg8/green_2.png',
      wild: 'https://image.ibb.co/dPStdz/wild.png',
      'wild+4': 'https://image.ibb.co/jKctdz/wild_4.png'
    },
    blue: {
      '0': 'https://image.ibb.co/im3vPT/blue_0.png',
      '1': 'https://image.ibb.co/k4Aydo/blue_1.png',
      '2': 'https://image.ibb.co/efuPJo/blue_2.png',
      '3': 'https://image.ibb.co/fyqLr8/blue_3.png',
      '4': 'https://image.ibb.co/kbOJdo/blue_4.png',
      '5': 'https://image.ibb.co/mHnuJo/blue_5.png',
      '6': 'https://image.ibb.co/bW81yo/blue_6.png',
      '7': 'https://image.ibb.co/dLwodo/blue_7.png',
      '8': 'https://image.ibb.co/nqyejT/blue_8.png',
      '9': 'https://image.ibb.co/kRrMyo/blue_9.png',
      skip: 'https://image.ibb.co/buExM8/blue_skip.png',
      reverse: 'https://image.ibb.co/cuQ418/blue_reverse.png',
      '+2': 'https://image.ibb.co/nx2TTo/blue_2.png',
      wild: 'https://image.ibb.co/dPStdz/wild.png',
      'wild+4': 'https://image.ibb.co/jKctdz/wild_4.png'
    },
    yellow: {
      '0': 'https://image.ibb.co/kf5ZjT/yellow_0.png',
      '1': 'https://image.ibb.co/d6o9Jo/yellow_1.png',
      '2': 'https://image.ibb.co/ghf0PT/yellow_2.png',
      '3': 'https://image.ibb.co/eHZido/yellow_3.png',
      '4': 'https://image.ibb.co/d9tLPT/yellow_4.png',
      '5': 'https://image.ibb.co/b6CEjT/yellow_5.png',
      '6': 'https://image.ibb.co/bzFZjT/yellow_6.png',
      '7': 'https://image.ibb.co/eD0ZjT/yellow_7.png',
      '8': 'https://image.ibb.co/mfa0PT/yellow_8.png',
      '9': 'https://image.ibb.co/h4JLPT/yellow_9.png',
      skip: 'https://image.ibb.co/btpmET/yellow_skip.png',
      reverse: 'https://image.ibb.co/kbt2oo/yellow_reverse.png',
      '+2': 'https://image.ibb.co/dvVtuT/yellow_2.png',
      wild: 'https://image.ibb.co/dPStdz/wild.png',
      'wild+4': 'https://image.ibb.co/jKctdz/wild_4.png'
    }
  }
}

module.exports.gameStatus = async (colour, type, action, game, guild, util) => {
  const embed = new RichEmbed()
    .setColor(colours[colour])
    .setThumbnail(images.cards[colour][type])
    .setDescription(action)

  const currentPlayer = await guild.fetchMember(game.state.currentPlayer.id)

  let totalCards = ''

  await asyncForEach(game.players.array(), async player => {
    const member = await guild.fetchMember(player.id)
    const username = member.user.username
    let theString = `${
      currentPlayer.id === player.id ? '• ' + username : username
    }: ${player.hand.length}\n`
    totalCards += theString
  })

  embed.addField('Current Card', `${colour} ${type}`, true)

  embed.addField('Players', totalCards, true)

  embed.setFooter(
    `It's ${currentPlayer.user.username}'s turn | Draw pile: ${
      game.state.drawPile.length
    } | Discarded: ${game.state.discardedCards.length}`,
    currentPlayer.avatarURL
  )
  return embed
}

module.exports.hand = (player, guild, starting, currentCard) => {
  let colour = currentCard.name
  const embed = new RichEmbed()
    .setDescription(
      starting
        ? `Game started! Here are your cards`
        : `It's your turn! The current card is a ${colour} ${currentCard.type}`
    )
    .setColor(colours[colour])
    .setThumbnail(images.cards[colour][currentCard.type])

  const cards = []
  player.hand.forEach(card => {
    const _card = []
    if (card.name) _card.push(card.name)
    _card.push(card.type)

    cards.push(_card.join(' '))
  })
  embed.addField('Cards', cards.join(', '))
  embed.setFooter(`Total cards: ${player.hand.length} | Server: ${guild.name}`)

  return embed
}

module.exports.draw = (card, guild) => {
  let colour = card[0].name
  const embed = new RichEmbed()
    .setDescription(
      `You drew a ${colour !== undefined ? colour : ''} ${card[0].type}`
    )
    .setFooter(`Server: ${guild.name}`)

  if (card.type === 'wild' || card.type === 'wild+4') {
    embed.setThumbnail(images.cards[0][card[0].type])
  } else {
    embed.setColor(colours[colour])
    embed.setThumbnail(images.cards[colour][card[0].type])
  }

  return embed
}

module.exports.actionDraw = (cards, currentCard, guild) => {
  const embed = new RichEmbed()
    .setDescription(`You had to draw ${cards.length} cards`)
    .setColor(colours[currentCard.name])
    .setThumbnail(images.cards[currentCard.name][currentCard.type])
    .setFooter(`Server: ${guild.name}`)

  const cardArray = []
  cards.forEach(card => {
    const _card = []
    if (card.name) _card.push(card.name)
    _card.push(card.type)
    cardArray.push(_card.join(' '))
  })
  embed.addField('Cards', cardArray.join(', '))

  return embed
}

module.exports.success = message => {
  const embed = new RichEmbed()
    .setAuthor(message, images.checkmark)
    .setColor(colours.success)
  return embed
}
