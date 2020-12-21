import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import Login from "@/layouts/login"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("layouts/login", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Login, {
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
})
