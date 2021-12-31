import snackbar from '~/composables/snackbar/snackbar'
import dialog from '~/composables/dialog/dialog'

export default localVue => {
  const plugin = {
    $snackbar: snackbar,
    $dialog: dialog
  }

  Object.keys(plugin).map(key => (localVue.prototype[key] = plugin[key]))

  if (!localVue.prototype.$nuxt) {
    localVue.prototype.$nuxt = {
      context: {}
    }
  }

  localVue.prototype.$nuxt.context.app = plugin
}
