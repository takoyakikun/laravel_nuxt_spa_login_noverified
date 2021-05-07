import snackbar from '~/composition/snackbar/snackbar'

export default (_, inject) => {
  inject('snackbar', snackbar)
}
