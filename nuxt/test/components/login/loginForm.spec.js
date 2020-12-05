import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import LoginForm from "@/components/login/loginForm"
import Form from "@/components/form/form"
import { ValidationObserver } from "vee-validate"

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store(storeConfig)
const vuetify = new Vuetify()

jest.useFakeTimers()

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/login/loginForm", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(LoginForm, {
        localVue,
        store,
        vuetify,
        sync: false,
        stubs: {
          Form
        }
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe("フォームバリデーションテスト", () => {
    let wrapper
    let formWrapper
    beforeEach(() => {
      wrapper = mount(ValidationObserver, {
        localVue,
        store,
        vuetify,
        sync: false,
        slots: {
          default: LoginForm
        }
      })
      formWrapper = wrapper.findComponent(LoginForm)
    })

    describe("Login", () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='login']")
        validation = formWrapper.vm.$refs.loginValidation
      })

      test("required", async () => {
        form.setValue("")
        await wrapper.vm.validate()
        expect(validation.getFailedRules().required).toBeTruthy()
      })

      test("max", async () => {
        form.setValue("a".repeat(256))
        await wrapper.vm.validate()
        expect(validation.getFailedRules().max).toBeTruthy()
      })

      test("email", async () => {
        form.setValue("aaa")
        await wrapper.vm.validate()
        expect(validation.getFailedRules().email).toBeTruthy()
      })

      test("valid", async () => {
        form.setValue("test@test.com")
        await wrapper.vm.validate()
        expect(Object.keys(validation.getFailedRules()).length).toBe(0)
      })
    })

    describe("Password", () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='password']")
        validation = formWrapper.vm.$refs.passwordValidation
      })

      test("required", async () => {
        form.setValue("")
        await wrapper.vm.validate()
        expect(validation.getFailedRules().required).toBeTruthy()
      })

      test("valid", async () => {
        form.setValue("password")
        await wrapper.vm.validate()
        expect(Object.keys(validation.getFailedRules()).length).toBe(0)
      })
    })
  })
})
