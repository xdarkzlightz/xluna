require('@babel/register')({
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
          '@eclipse/database': './src/eclipse-engine/database/database.js',
          '@eclipse': './src/eclipse-engine/',
          '@uno': './src/modules/uno/',
          '@info': './src/modules/info/',
          '@reddit': './src/modules/reddit/',
          '@tags': './src/modules/tags/',
          '@moderation': './src/modules/moderation',
          '@serverutil': './src/modules/serverutil/'
        }
      }
    ]
  ]
})

module.exports = require('./src/bot.js')
