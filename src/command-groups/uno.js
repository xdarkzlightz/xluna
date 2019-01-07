import {
  createGame,
  startGame,
  endGame,
  exitGame,
  joinGame,
  leaveGame,
  kickFromGame,
  playCard,
  drawCard,
  yellUno,
  calloutUno
} from '@uno/commands'

export const GroupConfig = {
  name: 'uno',
  description: "Uno commands! Who doesn't love playing uno?"
}

export const create = {
  config: {
    description: 'Creates a game',
    usage: 'create'
  },
  run: createGame
}

export const start = {
  config: {
    description: 'Starts a game',
    usage: 'start'
  },
  run: startGame
}

export const end = {
  config: {
    description: 'Ends a game',
    usage: 'end'
  },
  run: endGame
}

export const exit = {
  config: {
    description: 'Removes the game',
    usage: 'exit'
  },
  run: exitGame
}

export const join = {
  config: {
    description: 'Lets you join a game',
    usage: 'join'
  },
  run: joinGame
}

export const leave = {
  config: {
    description: 'Lets you leave a game',
    usage: 'leave'
  },
  run: leaveGame
}

export const kick = {
  config: {
    args: [
      {
        type: 'member',
        name: 'player'
      }
    ],
    description: 'Lets you kick a player from the game',
    usage: 'kick (player)',
    example: 'kick xdarkzlightz'
  },
  run: kickFromGame
}

export const play = {
  config: {
    args: [
      {
        type: 'string',
        name: 'colour',
        values: ['red', 'green', 'blue', 'yellow', 'wild', 'wild+4']
      },
      {
        type: 'string',
        name: 'type',
        values: [
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '+2',
          'reverse',
          'skip',
          'red',
          'green',
          'blue',
          'yellow'
        ]
      }
    ],
    description: 'Lets you play a card from your hand',
    usage: 'play (colour) (type)',
    example: 'play wild+4 red'
  },
  run: playCard
}

export const draw = {
  config: {
    description: 'Lets you draw a card from the draw pile',
    usage: 'draw'
  },
  run: drawCard
}

export const yell = {
  config: {
    description: 'Lets you yell uno when you have one card left',
    usage: 'yell'
  },
  run: yellUno
}

export const callout = {
  config: {
    description: 'Lets you call someone out',
    usage: 'callout'
  },
  run: calloutUno
}
