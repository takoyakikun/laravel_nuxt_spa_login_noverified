module.exports = {
  prompt: ({ inquirer }) => {
    const fs = require('fs')
    const path = require('path')

    // middlewareの選択肢
    const middlewares = fs
      .readdirSync('middleware')
      .filter(file => file !== 'README.md')
      .map(file => path.basename(file, '.js'))

    // layoutの選択肢
    const layouts = fs
      .readdirSync('layouts')
      .filter(file => file !== 'README.md')
      .map(file => path.basename(file, '.vue'))

    const questions = [
      {
        type: 'input',
        name: 'directory',
        message: 'ディレクトリを入力'
      },
      {
        type: 'input',
        name: 'name',
        message: 'page名を入力'
      },
      {
        type: 'input',
        name: 'title',
        message: 'titleを入力'
      },
      {
        type: 'select',
        name: 'middleware',
        message: 'middlewareを選択',
        choices: middlewares
      },
      {
        type: 'select',
        name: 'layout',
        message: 'layoutを選択',
        choices: layouts
      },
      {
        type: 'toggle',
        name: 'test',
        message: 'テストファイルを作成',
        enabled: 'Yes',
        disabled: 'No',
        initial: 'Yes'
      }
    ]

    return inquirer.prompt(questions)
  }
}
