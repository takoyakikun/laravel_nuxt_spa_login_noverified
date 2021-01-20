export default {
  state: {},

  // ダイアログのステータスを作成
  createDialog(props, defaultOptions = {}) {
    const state = {
      value: false
    }

    // name をセット
    if (props.name) {
      state.name = props.name
    } else {
      // propsからnameの設定が無かった場合は dialog-○ の形式でセット
      state.name = "dialog-" + (Object.keys(this.state).length + 1)
    }

    // color をセット
    if (props.color) {
      state.color = props.color
    }

    // title をセット
    if (props.title) {
      state.title = props.title
    }

    // デフォルトのoptionsとpropsから設定されたoptionsをマージする
    state.options = { ...defaultOptions, ...props.options }

    // ダイアログのステータスをセットする
    this.state[state.name] = state

    return this.state[state.name]
  },

  // ダイアログを開く
  openDialog(name) {
    this.state[name].value = true
  },

  // ダイアログを閉じる
  closeDialog(name) {
    this.state[name].value = false
  }
}
