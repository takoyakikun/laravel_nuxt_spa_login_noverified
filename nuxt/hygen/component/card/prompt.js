module.exports = [
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
    name: 'actions',
    message: 'フッターを入れる',
    enabled: 'Yes',
    disabled: 'No',
    initial: 'Yes'
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
