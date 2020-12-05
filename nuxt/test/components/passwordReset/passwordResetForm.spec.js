import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import PasswordResetForm from "@/components/passwordReset/passwordResetForm"
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

describe("components/passwordReset/passwordResetForm", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordResetForm, {
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
          default: PasswordResetForm
        }
      })
      formWrapper = wrapper.findComponent(PasswordResetForm)
    })

    describe("メールアドレス", () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='email']")
        validation = formWrapper.vm.$refs.emailValidation
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

    describe("パスワード", () => {
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

    describe("パスワード(確認)", () => {
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
