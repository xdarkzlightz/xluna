import {
  hand,
  gameStatus,
  actionDraw,
  draw as embedDraw
} from '../modules/uno/embed'

import { asyncForEach } from '@eclipse/util/array'

export function createGame (ctx) {
  const gameCreated = ctx.client.gameEngine.newGame('uno', {
    maxPlayers: 10,
    id: ctx.channel.id.toString(),
    owner: ctx.member.id,
    startingHandLength: 7
  })

  if (gameCreated) {
    ctx.say('Game created!, other people can join it with /join')
  } else {
    ctx.say(
      'Could not create game, one probably already exists in this channel!'
    )
  }
}

export async function startGame (ctx) {
  const game = ctx.client.gameEngine.getGame(ctx.channel.id)

  if (game) {
    if (ctx.member.id !== game.settings.owner) {
      return ctx.say("Could not start game, you're not the game owner!")
    } else if (game.state.started === true) {
      return ctx.say('Could not start game, the game is already started!')
    }

    const started = game.start()
    if (!started) {
      return ctx.say("Could not start game, you're alone!")
    } else {
      let noDM = []
      await asyncForEach(game.players.array(), async player => {
        const member = await ctx.guild.fetchMember(player.id)
        const dm = await member.createDM()
        await dm
          .send(hand(player, ctx.guild, true, game.state.currentCard))
          .catch(() => {
            noDM.push(member.user.username)
          })
      })

      if (noDM.length > 0) {
        game.end()
        return ctx.say(
          `Could not start game. The following people have their dm's disabled: ${noDM.join(
            ', '
          )}`
        )
      }

      ctx.say(
        await gameStatus(
          game.state.currentCard.name,
          game.state.currentCard.type,
          'Game started!',
          game,
          ctx.guild,
          ctx.client.util
        )
      )
    }
  } else {
    ctx.say(
      "Could not start game, a game probably doesn't exist in the channel!"
    )
  }
}

export function endGame (ctx) {
  const game = ctx.client.gameEngine.getGame(ctx.channel.id)
  if (game) {
    if (ctx.member.id !== game.settings.owner) {
      return ctx.say("Could not end game, you're not the game owner!")
    } else if (!game.state.started) {
      return ctx.say(
        "Could not end game, game hasn't started yet, if you'd like to remove the game use /exit!"
      )
    }
    const gameEnded = game.end()
    if (gameEnded) {
      ctx.say('Ended game!')
    } else {
      ctx.say('Something went wrong!')
    }
  } else {
    ctx.say("Could not end game, a game probably doesn't exist in the channel!")
  }
}

export function removeGame (ctx) {
  const game = ctx.client.gameEngine.getGame(ctx.channel.id)
  if (game) {
    if (ctx.member.id !== game.settings.owner) {
      return ctx.say("Could not exit game, you're not the game owner!")
    }
    const gameRemoved = ctx.client.gameEngine.removeGame(ctx.channel.id)
    if (gameRemoved) {
      ctx.say('Removed game!')
    } else {
      ctx.say('Something went wrong!')
    }
  } else {
    ctx.say(
      "Could not exit game, a game probably doesn't exist in the channel!"
    )
  }
}

export function joinGame (ctx) {
  const game = ctx.client.gameEngine.getGame(ctx.channel.id)
  if (game) {
    if (game.state.started) {
      return ctx.say("Can't join game! It's already started!")
    }
    const added = game.addPlayer(ctx.member.id)
    if (!added) {
      ctx.say("You're already in the game!")
    } else {
      ctx.say(`${ctx.author.username} has joined the game!`)
    }
  } else {
    ctx.say(
      "Could not join game, a game probably doesn't exist in the channel!"
    )
  }
}

export function leaveGame (ctx) {
  const game = ctx.client.gameEngine.getGame(ctx.channel.id)
  if (game) {
    if (ctx.author.id === game.settings.owner) {
      return ctx.say(
        "Could not leave game, you're the game owner. If you want to leave you have to do /exit"
      )
    }
    const left = game.removePlayer(ctx.author.id)
    if (!left) {
      ctx.say("Could not leave game, you're not even in one")
    } else {
      ctx.say(`${ctx.author.username} has left the game`)
    }
  } else {
    ctx.say(
      "Could not leave game, a game probably doesn't exist in the channel!"
    )
  }
}

export function kickFromGame (ctx, { player }) {
  const game = ctx.client.gameEngine.getGame(ctx.channel.id)
  if (game) {
    if (ctx.member.id !== game.settings.owner) {
      return ctx.say(
        "Could not kick player from game, you're not the game owner!"
      )
    }
    const removed = game.removePlayer(player.id)
    if (!removed) {
      ctx.say("Could not kick player from game, they're not even in one")
    } else {
      ctx.say(`${player.name} has been kicked from the game`)
    }
  } else {
    ctx.say(
      "Could not kick player, a game probably doesn't exist in the channel!"
    )
  }
}

export async function playCard (ctx, { colour, type }) {
  const game = ctx.client.gameEngine.getGame(ctx.channel.id)
  if (game) {
    if (!game.state.started) {
      return ctx.say(
        "Could not play card, game hasn't started yet, if you'd like to remove the game use /exit!"
      )
    }

    if (game.state.currentPlayer.id !== ctx.author.id) {
      return ctx.say("Could not play card, It's not your turn!")
    }
    const played = game.play(ctx.author.id, { colour, type })
    if (played.err) return ctx.say(`Could not play card, ${played.err}`)
    if (played.winner) {
      const winner = await ctx.guild.fetchMember(played.winner)
      return ctx.say(`${winner.user.username} has won the game!`)
    }

    if (played.action === 'draw') {
      const member = await ctx.guild.fetchMember(played.target.player)
      const dm = await member.createDM()
      await dm
        .send(
          actionDraw(played.target.cards, game.state.currentCard, ctx.guild)
        )
        .catch(() => {
          ctx.say(
            'Could not dm the next player! They probably turned their dms off. Ending game. How sad.'
          )
          game.end()
        })
      ctx.say(
        await gameStatus(
          game.state.currentCard.name,
          game.state.currentCard.type,
          `${ctx.author.username} made ${member.user.username} draw cards`,
          game,
          ctx.guild,
          ctx.client.util
        )
      )
    } else if (played.action === 'skip') {
      const member = await ctx.guild.fetchMember(played.target.player)
      ctx.say(
        await gameStatus(
          game.state.currentCard.name,
          game.state.currentCard.type,
          `${ctx.author.username} skipped ${member.user.username}`,
          game,
          ctx.guild,
          ctx.client.util
        )
      )
    } else if (played.action === 'reverse') {
      ctx.say(
        await gameStatus(
          game.state.currentCard.name,
          game.state.currentCard.type,
          `${ctx.author.username} reversed the turn rotation!`,
          game,
          ctx.guild,
          ctx.client.util
        )
      )
    } else {
      ctx.say(
        await gameStatus(
          game.state.currentCard.name,
          game.state.currentCard.type,
          `${ctx.author.username} played a card`,
          game,
          ctx.guild,
          ctx.client.util
        )
      )
    }
    const nextPlayer = game.state.currentPlayer
    const member = await ctx.guild.fetchMember(nextPlayer.id)
    const dm = await member.createDM()
    await dm
      .send(hand(nextPlayer, ctx.guild, false, game.state.currentCard))
      .catch(() => {
        ctx.say(
          'Could not dm the next player! They probably turned their dms off. Ending game. How sad.'
        )
        game.end()
      })
  } else {
    ctx.say(
      "Could not play a card, a game probably doesn't exist in the channel!"
    )
  }
}

export async function drawCard (ctx) {
  const game = ctx.client.gameEngine.getGame(ctx.channel.id)
  if (game) {
    if (game.state.currentPlayer.id !== ctx.author.id) {
      return ctx.say("Could not draw card, It's not your turn!")
    }
    const card = game.addCardsToPlayer(ctx.author.id, 1)
    const authorDM = await ctx.author.createDM()

    await authorDM.send(embedDraw(card, ctx.guild)).catch(() => {
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
        `${ctx.author.username} drew a card`,
        game,
        ctx.guild,
        ctx.client.util
      )
    )

    const nextPlayer = game.state.currentPlayer
    const member = await ctx.guild.fetchMember(nextPlayer.id)
    const dm = await member.createDM()

    await dm
      .send(hand(nextPlayer, ctx.guild, false, game.state.currentCard))
      .catch(() => {
        ctx.say(
          'Could not dm the next player! They probably turned their dms off. Ending game. How sad.'
        )
        game.end()
      })
  } else {
    ctx.say(
      "Could not draw a card, a game probably doesn't exist in the channel!"
    )
  }
}

export function yellUno (ctx) {
  const game = ctx.client.gameEngine.getGame(ctx.channel.id)
  if (game) {
    if (!game.state.started) {
      return ctx.say("Could not yell uno, game hasn't started yet!")
    }

    const uno = game.uno(ctx.author.id)
    if (uno) {
      ctx.say(`${ctx.author.username} has called uno!`)
    } else {
      ctx.say("You can't call uno!")
    }
  } else {
    ctx.say("Can't yell uno, a game probably doesn't exist in the channel!")
  }
}

export async function calloutUno (ctx) {
  const game = ctx.client.gameEngine.getGame(ctx.channel.id)
  if (game) {
    if (!game.state.started) {
      return ctx.say("Could not call anyone out, game hasn't started yet!")
    }

    const uno = game.callout()
    if (!uno) {
      ctx.say("There's no one to callout!")
    } else {
      const member = await ctx.guild.fetchMember(uno.player)
      ctx.say(`${member.user.username} got called out`)
    }
  } else {
    ctx.say("Can't yell uno, a game probably doesn't exist in the channel!")
  }
}
