import snackbar from "@/composable/snackbar/snackbar"

export default localVue => {
  localVue.prototype.$snackbar = snackbar
  localVue.prototype.$nuxt = {
    context: {
      app: {
        $snackbar: snackbar
      }
    }
  }
}
