import { RichEmbed } from 'discord.js'
import { randomInt } from '@util/number'

export function askQuestion (ctx) {
  const questionMark =
    'https://i.ibb.co/RD7BBjt/5a381377ac85d3-5406702915136244397067.png'
  const responses = [
    [
      'It is certain',
      'Without a doubt',
      'You may rely on it',
      'Yes definitely',
      'It is decidedly so',
      'As I see it, yes',
      'Most likely',
      'Yes',
      'Outlook good',
      'Signs point to yes'
    ],
    [
      'Reply hazy try again',
      'Better not tell you now',
      'Ask again later',
      'Cannot predict now',
      'Concentrate and ask again'
    ],
    [
      'Don’t count on it',
      'Outlook not so good',
      'My sources say no',
      'Very doubtful',
      'My reply is no'
    ]
  ]

  const category = randomInt(0, 3)

  if (category === 0) {
    ctx.success(responses[0][randomInt(0, responses[0].length)])
  } else if (category === 2) {
    ctx.error(responses[2][randomInt(0, responses[2].length)])
  } else {
    const embed = new RichEmbed().setAuthor(
      responses[1][randomInt(0, responses[1].length)],
      questionMark
    )
    ctx.say(embed)
  }
}

export function sayMessage (ctx, { message }) {
  if (ctx.msg.mentions.everyone) {
    return ctx.say("You can't mention everyone in a message!")
  } else if (ctx.msg.mentions.here) {
    return ctx.say("You can't mention here in a message!")
  }

  ctx.say(message)
}

export function isCute (ctx, { member }) {
  const cute = randomInt(0, 2)
  const embed = new RichEmbed().setColor(0xf52060)
  if (!cute) {
    embed.setDescription(`😢 looks like ${member.user.username} isn't cute!`)
  } else {
    embed.setDescription(`${member.user.username} is cute! 😉`)
  }
  ctx.say(embed)
}
