import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "~/test/storeConfig"
import * as types from "~/store/mutation-types"
import setConfigData from "~/test/setConfigData"
import PasswordChangeForm from "~/components/users/forms/passwordChangeForm"
import Form from "~/components/form/form"
import { ValidationObserver } from "vee-validate"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/" + types.CONFIG_SET_CONFIG, setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(async () => {
      wrapper = shallowMount(PasswordChangeForm, {
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

      test("成功", async () => {
        // 入力データをセット
        form.setValue("password")

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(Object.keys(validation.failedRules).length).toBe(0)
      })
    })

    describe("変更後のパスワード", () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='password']")
        validation = formWrapper.vm.$refs.passwordValidation
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

      test("minエラー", async () => {
        // 入力データをセット
        form.setValue("a".repeat(7))
        await wrapper.vm.validate()
        expect(validation.failedRules.min).toBeTruthy()
      })

      test("成功", async () => {
        // 入力データをセット
        form.setValue("password")

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(Object.keys(validation.failedRules).length).toBe(0)
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

      test("requiredエラー", async () => {
        // 入力データをセット
        form.setValue("")
        passwordForm.setValue("password")

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.required).toBeTruthy()
      })

      test("minエラー", async () => {
        // 入力データをセット
        form.setValue("a".repeat(7))
        passwordForm.setValue("password")

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.min).toBeTruthy()
      })

      test("confirmedエラー", async () => {
        // 入力データをセット
        form.setValue("password")
        passwordForm.setValue("aaaaaaaa")

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.confirmed).toBeTruthy()
      })

      test("成功", async () => {
        // 入力データをセット
        form.setValue("password")
        passwordForm.setValue("password")

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
