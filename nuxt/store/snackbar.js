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
  openSnackbar(state, snackbar) {
    if (snackbar.options) {
      state.options = snackbar.options
    } else {
      state.options = {}
    }
    state.value = true
    state.text = snackbar.text
  },
  // snackbarの非表示をセット
  closeSnackbar(state) {
    state.value = false
  }
}

export const actions = {
  // snackbarを開く
  openSnackbar({ commit }, snackbar) {
    commit("openSnackbar", snackbar)
  },
  // snackbarを閉じる
  closeSnackbar({ commit }) {
    commit("closeSnackbar")
  }
}
