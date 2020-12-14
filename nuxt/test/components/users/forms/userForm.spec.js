import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import UserForm from "@/components/users/forms/userForm"
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

describe("components/users/userForm", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(async () => {
      wrapper = shallowMount(UserForm, {
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

    describe("権限ごとに選択できる権限を変える", () => {
      test("開発者権限", () => {
        // 選択オプションデータをセット
        wrapper.vm.$store.commit("users/setRoleOptions", [1, 2, 3])

        // 全ての権限を返す
        expect(wrapper.vm.role.map(item => item.value)).toEqual([1, 2, 3])
      })

      test("それ以外", () => {
        // 選択オプションデータをセット
        wrapper.vm.$store.commit("users/setRoleOptions", [2, 3])

        // 管理者以外を返す
        expect(wrapper.vm.role.map(item => item.value)).toEqual([2, 3])
      })
    })
  })

  describe("項目表示テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(UserForm, {
        localVue,
        store,
        vuetify,
        sync: false,
        propsData: {
          drawer: false
        }
      })
    })

    test("自ユーザー", async () => {
      // 自ユーザー設定
      await wrapper.setProps({ myuser: true })

      // アクセス権限フォーム項目
      expect(wrapper.find("[data-test='roleForm']").exists()).toBeFalsy()
    })

    test("自ユーザー以外", async () => {
      // 自ユーザー設定
      await wrapper.setProps({ myuser: false })

      // アクセス権限フォーム項目
      expect(wrapper.find("[data-test='roleForm']").exists()).toBeTruthy()
    })

    test("フォームタイプ無し", async () => {
      // createフォームタイプ設定
      await wrapper.setProps({ formType: "" })

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeFalsy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeFalsy()
    })

    test("createフォームタイプ", async () => {
      // createフォームタイプ設定
      await wrapper.setProps({ formType: "create" })

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeTruthy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeTruthy()
    })

    test("usersCreateフォームタイプ", async () => {
      // createフォームタイプ設定
      await wrapper.setProps({ formType: "usersCreate" })

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeFalsy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeFalsy()
    })

    test("editフォームタイプ", async () => {
      // createフォームタイプ設定
      await wrapper.setProps({ formType: "edit" })

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeFalsy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeFalsy()
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
          default: UserForm
        }
      })
      formWrapper = wrapper.findComponent(UserForm)
    })

    describe("ユーザー名", () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='name']")
        validation = formWrapper.vm.$refs.nameValidation
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

      test("valid", async () => {
        form.setValue("テスト")
        await wrapper.vm.validate()
        expect(Object.keys(validation.getFailedRules()).length).toBe(0)
      })
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
