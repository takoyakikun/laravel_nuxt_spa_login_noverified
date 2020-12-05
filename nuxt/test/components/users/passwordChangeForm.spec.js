import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import PasswordChangeForm from "@/components/users/passwordChangeForm"
import Form from "@/components/form/form"
import { ValidationObserver } from "vee-validate"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/setConfig", setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/users/passwordChangeForm", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(async () => {
      wrapper = shallowMount(PasswordChangeForm, {
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
          default: PasswordChangeForm
        }
      })
      formWrapper = wrapper.findComponent(PasswordChangeForm)
    })

    describe("現在のパスワード", () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='current_password']")
        validation = formWrapper.vm.$refs.currentPasswordValidation
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

    describe("変更後のパスワード", () => {
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

      test("min", async () => {
        form.setValue("a".repeat(7))
        await wrapper.vm.validate()
        expect(validation.getFailedRules().min).toBeTruthy()
      })

      test("valid", async () => {
        form.setValue("password")
        await wrapper.vm.validate()
        expect(Object.keys(validation.getFailedRules()).length).toBe(0)
      })
    })

    describe("変更後のパスワード(確認)", () => {
      let form
      let passwordForm
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='password_confirmation']")
        passwordForm = wrapper.find("input[name='password']")
        validation = formWrapper.vm.$refs.passwordConfirmationValidation
      })

      test("required", async () => {
        form.setValue("")
        passwordForm.setValue("password")
        await wrapper.vm.validate()
        expect(validation.getFailedRules().required).toBeTruthy()
      })

      test("min", async () => {
        form.setValue("a".repeat(7))
        passwordForm.setValue("password")
        await wrapper.vm.validate()
        expect(validation.getFailedRules().min).toBeTruthy()
      })

      test("confirmed", async () => {
        form.setValue("password")
        passwordForm.setValue("aaaaaaaa")
        await wrapper.vm.validate()
        expect(validation.getFailedRules().confirmed).toBeTruthy()
      })

      test("valid", async () => {
        form.setValue("password")
        passwordForm.setValue("password")
        await wrapper.vm.validate()
        expect(Object.keys(validation.getFailedRules()).length).toBe(0)
      })
    })
  })
})
