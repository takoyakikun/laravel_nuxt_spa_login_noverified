import snackbar from "@/composable/snackbar/snackbar"

export default (_, inject) => {
  inject("snackbar", snackbar)
}
