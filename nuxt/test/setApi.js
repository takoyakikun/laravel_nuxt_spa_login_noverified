import path from 'path'
import api from '~/plugins/api/api'

export default (localVue, { $axios, store }) => {
  const modules = require.context(path.resolve('./apis'), false, /\.js$/)
  modules.keys().map(key => {
    api.setApiModule(
      modules(key).default($axios, store),
      path.basename(key, '.js')
    )
  })

  localVue.prototype.$api = api.modules
}
