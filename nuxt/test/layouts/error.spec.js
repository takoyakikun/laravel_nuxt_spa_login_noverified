import { createLocalVue, shallowMount, RouterLinkStub } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import Error from "@/layouts/error"

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

describe("layouts/error", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Error, {
      localVue,
      store,
      vuetify,
      sync: false,
      propsData: {
        error: {
          statusCode: 404
        }
      },
      stubs: {
        NuxtLink: RouterLinkStub,
        nuxt: true
      }
    })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test("statusCodeが404", () => {
    // statusCodeを404にする
    wrapper.setProps({
      error: {
        statusCode: 404
      }
    })

    // "404 Not Found" を返す
    const head = wrapper.vm.$options.head.call(wrapper.vm)
    expect(head.title).toBe("404 Not Found")
  })

  test("statusCodeが404以外", () => {
    // statusCodeを404以外にする
    wrapper.setProps({
      error: {
        statusCode: 403
      }
    })

    // "An error occurred" を返す
    const head = wrapper.vm.$options.head.call(wrapper.vm)
    expect(head.title).toBe("An error occurred")
  })
})
