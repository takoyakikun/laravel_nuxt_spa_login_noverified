import Vuex from 'vuex'

// storeを全て取得
const stores = require.context('../store', true, /\.js$/)

// modulesにstoreをセットする
const modules = {}
stores.keys().forEach(key => {
  const store = stores(key)
  modules[key.replace(/^\.\//, '').replace(/\.\w+$/, '')] = {
    namespaced: true,
    state: store.state,
    getters: store.getters,
    mutations: store.mutations,
    actions: store.actions
  }
})

export default localVue => {
  const store = new Vuex.Store({ modules })

  if (!localVue.prototype.$nuxt) {
    localVue.prototype.$nuxt = {
      context: {}
    }
  }

  localVue.prototype.$nuxt.context.store = store

  return store
}
