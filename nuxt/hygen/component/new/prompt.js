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
    type: 'toggle',
    name: 'test',
    message: 'テストファイルを作成',
    enabled: 'Yes',
    disabled: 'No',
    initial: 'Yes'
  }
]
