import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import Form from "@/components/form/form"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/form/form", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(Form, {
        localVue,
        vuetify,
        sync: false
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("フォーム送信", () => {
      // フォーム送信
      wrapper.vm.submit()

      // submitがemitされている
      expect(wrapper.emitted().submit).toBeTruthy()
    })
  })
})
