module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'middleware名を入力'
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
