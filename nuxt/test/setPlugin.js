import snackbar from '~/composition/snackbar/snackbar'
import dialog from '~/composition/dialog/dialog'

export default localVue => {
  const plugin = {
    $snackbar: snackbar,
    $dialog: dialog
  }

  Object.keys(plugin).map(key => (localVue.prototype[key] = plugin[key]))

  localVue.prototype.$nuxt = {
    context: {
      app: plugin
    }
  }
}
