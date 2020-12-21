import * as types from "./mutation-types"

export const state = () => ({
  value: false,
  text: "",
  options: {}
})

export const getters = {
  value: state => state.value,
  text: state => state.text,
  options: state => state.options
}

export const mutations = {
  // snackbarの表示をセット
  [types.SNACKBAR_OPEN_SNACKBAR](state, snackbar) {
    if (snackbar.options) {
      state.options = snackbar.options
    } else {
      state.options = {}
    }
    state.value = true
    state.text = snackbar.text
  },
  // snackbarの非表示をセット
  [types.SNACKBAR_CLOSE_SNACKBAR](state) {
    state.value = false
  }
}

export const actions = {
  // snackbarを開く
  openSnackbar({ commit }, snackbar) {
    commit(types.SNACKBAR_OPEN_SNACKBAR, snackbar)
  },
  // snackbarを閉じる
  closeSnackbar({ commit }) {
    commit(types.SNACKBAR_CLOSE_SNACKBAR)
  }
}
