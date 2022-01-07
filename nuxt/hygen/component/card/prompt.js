module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'input',
        name: 'directory',
        message: 'ディレクトリを入力'
      },
      {
        type: 'input',
        name: 'name',
        message: 'component名を入力'
      },
      {
        type: 'input',
        name: 'title',
        message: 'タイトル名を入力'
      },
      {
        type: 'input',
        name: 'color',
        message: 'カラーを入力'
      },
      {
        type: 'toggle',
        name: 'composable',
        message: 'composableを入れる',
        enabled: 'Yes',
        disabled: 'No'
      },
      {
        type: 'toggle',
        name: 'test',
        message: 'テストファイルを作成',
        enabled: 'Yes',
        disabled: 'No',
        initial: 'Yes'
      },
      {
        type: 'select',
        name: 'type',
        message: 'cardのタイプを選択',
        choices: ['plain', 'form']
      }
    ]

    // plainタイプの質問
    const plainQuestions = [
      {
        type: 'toggle',
        name: 'footer',
        message: 'フッターを入れる',
        enabled: 'Yes',
        disabled: 'No'
      }
    ]

    // formタイプの質問
    const formQuestions = [
      {
        type: 'input',
        name: 'actionText',
        message: 'アクションを入力'
      },
      {
        type: 'input',
        name: 'submitIcon',
        message: 'フォーム送信アイコンを入力'
      }
    ]

    return inquirer.prompt(questions).then(answers => {
      switch (answers.type) {
        case 'plain': {
          return inquirer.prompt(plainQuestions).then(plainAnswers => {
            const includeVue = '/includes/vue'
            const includeComposable = '/includes/composable'
            const includeTest = '/includes/test'

            return {
              ...answers,
              ...plainAnswers,
              includeVue,
              includeComposable,
              includeTest
            }
          })
        }
        case 'form': {
          return inquirer.prompt(formQuestions).then(formAnswers => {
            let includeVue = '/includes/form/vue'
            const includeComposable = '/includes/form/composable/composable'
            const includeTest = '/includes/form/test'

            // composableを入れる場合のincludeパス
            if (answers.composable) {
              includeVue = '/includes/form/composable/vue'
            }

            return {
              ...answers,
              ...formAnswers,
              includeVue,
              includeComposable,
              includeTest
            }
          })
        }
        default: {
          const includeVue = '/includes/vue'
          const includeComposable = '/includes/composable'
          const includeTest = '/includes/test'
          return { ...answers, includeVue, includeComposable, includeTest }
        }
      }
    })
  }
}
