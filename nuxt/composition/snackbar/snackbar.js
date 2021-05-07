export default {
  value: false,
  text: '',
  options: {},

  // snackbarを開く
  openSnackbar({ text, options }) {
    if (options) {
      this.options = options
    } else {
      this.options = {}
    }
    this.value = true
    this.text = text
  },

  // snackbarを閉じる
  closeSnackbar() {
    this.value = false
  }
}
