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
          '@engines/eclipse/command':
            './src/engines/eclipse-engine/command/command.js',
          '@engines/eclipse/core': './src/engines/eclipse-engine/core/core.js',
          '@engines/eclipse': './src/engines/eclipse-engine/',
          '@engines/game': './src/engines/game-engine/',
          '@modules': './src/bot/modules/',
          '@config': './config.js',
          '@util': './src/util/'
        }
      }
    ]
  ]
})

module.exports = require('./src/bot/bot.js')
