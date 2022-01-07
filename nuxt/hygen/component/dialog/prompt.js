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
        name: 'persistent',
        message: '外側をクリックしても閉じない',
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
        message: 'dialogのタイプを選択',
        choices: ['plain', 'form']
      }
    ]

    // formタイプの質問
    const formQuestions = [
      {
        type: 'select',
        name: 'formType',
        message: 'formのタイプを選択',
        choices: ['plain', 'create', 'edit']
      },
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
        case 'form': {
          return inquirer.prompt(formQuestions).then(formAnswers => {
            const includeVue = '/includes/form/vue'
            const includeTest = '/includes/form/test'

            // 変更フォームだけ専用のcomposableを指定
            let includeComposable = '/includes/form/composable'
            if (formAnswers.formType === 'edit') {
              includeComposable = '/includes/form/composableEdit'
            }

            // 変更フォームだけ送信メソッドをpatchにする
            let apiMethod = 'post'
            if (formAnswers.formType === 'edit') {
              apiMethod = 'patch'
            }

            // カラー・アクション・アイコンが入力されていない場合のデフォルト値を設定
            switch (formAnswers.formType) {
              case 'create': {
                if (!answers.color) answers.color = 'info'
                if (!formAnswers.actionText) formAnswers.actionText = '追加'
                if (!formAnswers.submitIcon) formAnswers.submitIcon = 'mdi-plus'
                break
              }
              case 'edit': {
                if (!answers.color) answers.color = 'success'
                if (!formAnswers.actionText) formAnswers.actionText = '変更'
                if (!formAnswers.submitIcon)
                  formAnswers.submitIcon = 'mdi-pencil'
                break
              }
            }
            return {
              ...answers,
              ...formAnswers,
              apiMethod,
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
