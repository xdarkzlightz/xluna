require('@babel/register')({
  sourceMaps: 'inline',
  retainLines: true,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: true
        }
      }
    ]
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@engines/eclipse': './src/engines/eclipse-engine/',
          '@engines/game': './src/engines/game-engine/',
          '@modules': './src/bot/modules/'
        }
      }
    ]
  ]
})

module.exports = require('./src/bot.js')
