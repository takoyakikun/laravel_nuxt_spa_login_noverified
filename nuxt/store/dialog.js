export const state = () => ({
  dialog: {}
})

export const getters = {
  // ダイアログの状態を name を指定して返す
  dialog: state => name => (state.dialog[name] ? state.dialog[name] : false)
}

export const mutations = {
  // ダイアログの表示/非表示をセット
  setDialog(state, { dialog, name }) {
    const dialogStatus = state.dialog
    dialogStatus[name] = dialog
    state.dialog = {}
    state.dialog = dialogStatus
  }
}

export const actions = {
  // ダイアログを開く
  openDialog({ commit }, name) {
    commit("setDialog", { dialog: true, name: name })
  },
  // ダイアログを閉じる
  closeDialog({ commit }, name) {
    commit("setDialog", { dialog: false, name: name })
  }
}
