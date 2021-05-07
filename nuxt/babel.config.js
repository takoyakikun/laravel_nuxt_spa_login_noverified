module.exports = {
  env: {
    test: {
      plugins: [['module-resolver'], 'require-context-hook'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ]
    }
  }
}
