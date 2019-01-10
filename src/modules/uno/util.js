import { hand, gameStatus, draw as embedDraw } from '@uno/embed'

module.exports.colours = {
  '1': 'red',
  '2': 'blue',
  '3': 'green',
  '4': 'yellow'
}

module.exports.types = {
  // numbers
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  // special cards
  '+2': '+2',
  reverse: 'reverse',
  skip: 'skip',
  wild: 'wild',
  'wild+4': 'wild+4'
}

export function startCountdown (oldPlayer, game, ctx) {
  return setTimeout(async () => {
    oldPlayer.strikes += 1
    let removed
    if (oldPlayer.strikes === 3) removed = this.removePlayer(oldPlayer.id)
    const card = this.addCardsToPlayer(oldPlayer.id, 1)
    const oldPlayerMember = await ctx.guild.fetchMember(oldPlayer.id)
    const oldPlayerDM = await oldPlayerMember.createDM()

    await oldPlayerDM.send(embedDraw(card, ctx.guild)).catch(() => {
      ctx.say(
        'Could not dm the player! They probably turned their dms off. Ending game. How sad.'
      )
      game.end()
    })
    game.nextTurn()
    ctx.say(
      await gameStatus(
        game.state.currentCard.name,
        game.state.currentCard.type,
        removed
          ? `${
            oldPlayerMember.user.username
          } took too long and got kicked from the game!`
          : `${oldPlayerMember.user.username} took too long!`,
        game,
        ctx.guild,
        ctx.client.util
      )
    )

    const nextPlayer = game.state.currentPlayer
    const newMember = await ctx.guild.fetchMember(nextPlayer.id)
    const dm = await newMember.createDM()

    await dm
      .send(hand(nextPlayer, ctx.guild, true, game.state.currentCard))
      .catch(() => {
        ctx.say(
          'Could not dm the next player! They probably turned their dms off. Ending game. How sad.'
        )
        game.end()
      })
  }, 10 * 1000)
}
