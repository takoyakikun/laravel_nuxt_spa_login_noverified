import Vuex from 'vuex'
import path from 'path'
import api from '~/plugins/api/api'

// storeを全て取得
const stores = require.context('../store', true, /\.js$/)

// modulesにstoreをセットする
const storeModules = {}
stores.keys().forEach(key => {
  const store = stores(key)
  storeModules[key.replace(/^\.\//, '').replace(/\.\w+$/, '')] = {
    namespaced: true,
    state: store.state,
    getters: store.getters,
    mutations: store.mutations,
    actions: store.actions
  }
})

const apiModules = require.context(path.resolve('./apis'), false, /\.js$/)

export default axios => {
  const store = new Vuex.Store({ modules: storeModules })

  // リダイレクト処理をモック
  const redirect = jest.fn()

  // apiモジュールファイルを読み込んでセットする
  apiModules.keys().map(key => {
    api.setApiModule(
      apiModules(key).default(axios, store),
      path.basename(key, '.js')
    )
  })
  const $api = api.modules

  const app = {
    $api
  }

  return { store, redirect, app }
}
