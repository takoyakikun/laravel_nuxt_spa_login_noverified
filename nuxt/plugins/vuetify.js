import Vue from 'vue'
import Vuetify from 'vuetify'
import ja from 'vuetify/es5/locale/ja.js'

Vue.use(Vuetify)

export default ctx => {
  const vuetify = new Vuetify({
    lang: {
      locales: { ja },
      current: 'ja'
    }
  })

  ctx.app.vuetify = vuetify
  ctx.$vuetify = vuetify.framework
}
