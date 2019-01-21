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
          '@eclipse/core': './src/eclipse-engine/core/core.js',
          '@eclipse/command': './src/eclipse-engine/command/command.js',
          '@eclipse/providers/mongo':
            './src/eclipse-engine/dbProvider/mongoProvider/mongoProvider.js',
          '@eclipse': './src/eclipse-engine/',
          '@uno': './src/modules/uno/',
          '@info': './src/modules/info/',
          '@reddit': './src/modules/reddit/',
          '@tags': './src/modules/tags/',
          '@moderation': './src/modules/moderation',
          '@serverutil': './src/modules/serverutil/',
          '@music': './src/modules/music/'
        }
      }
    ]
  ]
})

module.exports = require('./src/bot.js')
