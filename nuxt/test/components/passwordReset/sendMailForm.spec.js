import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import SendMailForm from "@/components/passwordReset/sendMailForm"
import Form from "@/components/form/form"
import { ValidationObserver } from "vee-validate"

const localVue = createLocalVue()
localVue.use(Vuex)

const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(SendMailForm, {
        localVue,
        store,
        vuetify,
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
        slots: {
          default: SendMailForm
        }
      })
      formWrapper = wrapper.findComponent(SendMailForm)
    })

    describe("メールアドレス", () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='email']")
        validation = formWrapper.vm.$refs.emailValidation
      })

      test("requiredエラー", async () => {
        // 入力データをセット
        form.setValue("")

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.required).toBeTruthy()
      })

      test("maxエラー", async () => {
        // 入力データをセット
        form.setValue("a".repeat(256))

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.max).toBeTruthy()
      })

      test("emailエラー", async () => {
        // 入力データをセット
        form.setValue("aaa")

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.email).toBeTruthy()
      })

      test("成功", async () => {
        // 入力データをセット
        form.setValue("test@test.com")

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(Object.keys(validation.failedRules).length).toBe(0)
      })
    })
  })
})
