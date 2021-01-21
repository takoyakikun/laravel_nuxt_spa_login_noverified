import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import Form from "~/components/form/form"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  let wrapper
  let mountOptions
  beforeEach(() => {
    mountOptions = {
      localVue,
      vuetify
    }
  })

  describe("", () => {
    beforeEach(() => {
      wrapper = shallowMount(Form, mountOptions)
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("フォーム送信", () => {
      // フォーム送信
      wrapper.vm.methods.submit()

      // submitがemitされている
      expect(wrapper.emitted().submit).toBeTruthy()
    })
  })
})
