import path from 'path'
import api from './api'

export default ({ $axios, store }) => {
  // 読み込んだモジュールをセットする
  const modules = require.context('~/apis', false, /\.js$/)
  modules.keys().map(key => {
    api.setApiModule(
      modules(key).default($axios, store),
      path.basename(key, '.js')
    )
  })

  return api.modules
}
