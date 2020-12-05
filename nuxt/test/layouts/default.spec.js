import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import Default from "@/layouts/default"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/setConfig", setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("layouts/default", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Default, {
      localVue,
      store,
      vuetify,
      sync: false,
      stubs: {
        nuxt: true
      }
    })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })

  describe("サイドバー", () => {
    test("開く", () => {
      // 初期値はfalse
      expect(wrapper.vm.drawer).toBeFalsy()

      // サイドバーを開く
      wrapper.vm.setDrawer(true)

      // 開いたのでtrue
      expect(wrapper.vm.drawer).toBeTruthy()
    })

    test("閉じる", () => {
      // 初期値をtrueにする
      wrapper.setData({
        drawer: true
      })
      expect(wrapper.vm.drawer).toBeTruthy()

      // サイドバーを閉じる
      wrapper.vm.setDrawer(false)

      // 閉じたのでfalse
      expect(wrapper.vm.drawer).toBeFalsy()
    })
  })
})
