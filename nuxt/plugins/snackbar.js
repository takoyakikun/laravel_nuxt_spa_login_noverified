import snackbar from '~/composables/snackbar/snackbar'

export default (_, inject) => {
  inject('snackbar', snackbar)
}
