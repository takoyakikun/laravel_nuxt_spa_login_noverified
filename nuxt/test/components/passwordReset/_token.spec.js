import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import VueRouter from "vue-router"
import axios from "axios"
import Api from "~/test/api"
import setPlugin from "~/test/setPlugin"
import storeConfig from "~/test/storeConfig"
import Token from "~/components/passwordReset/_token"

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  const ApiClass = new Api({ axios, store })
  localVue.prototype.$api = ApiClass
  setPlugin(localVue)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/passwordReset/_token", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(Token, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe("mount", () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()
      const route = { params: { token: "test" } }
      wrapper = mount(Token, {
        localVue,
        store,
        router,
        vuetify,
        mocks: { $nuxt: { $route: route } }
      })
    })

    describe("パスワードリセット", () => {
      let passwordResetValidate
      let axiosPost, axiosGet
      let routerPush
      beforeEach(async () => {
        // spyOn
        passwordResetValidate = jest.spyOn(
          wrapper.vm.$refs.passwordResetValidate,
          "validate"
        )
        axiosPost = jest.spyOn(axios, "post")
        axiosGet = jest.spyOn(axios, "get")
        routerPush = jest.spyOn(wrapper.vm.$router, "push")
      })

      describe("失敗", () => {
        beforeEach(() => {
          // エラーレスポンス
          const response = {
            status: 422
          }
          // axiosのレスポンスをモックする
          axios.post.mockImplementation(url => {
            return Promise.resolve(response)
          })
        })

        test("フロント側エラー", async () => {
          // パスワードリセット処理
          await wrapper.vm.passwordReset()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(passwordResetValidate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.passwordResetValidate.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPost).not.toHaveBeenCalled()
        })

        test("API側エラー", async () => {
          // フォームを入力してパスワードリセット処理
          wrapper.find("input[name='email']").setValue("test@test.com")
          wrapper.find("input[name='password']").setValue("password")
          wrapper
            .find("input[name='password_confirmation']")
            .setValue("password")
          await wrapper.vm.passwordReset()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(passwordResetValidate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith("/api/password/reset", {
            email: "test@test.com",
            password: "password",
            password_confirmation: "password",
            token: "test"
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$snackbar.text).toBe(
            "パスワードリセットに失敗しました。"
          )
          expect(wrapper.vm.$snackbar.options.color).toBe("error")
        })
      })

      test("成功", async () => {
        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.post.mockImplementation(url => {
          return Promise.resolve(response)
        })
        axios.get.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // フォームを入力してパスワードリセット処理
        wrapper.find("input[name='email']").setValue("test@test.com")
        wrapper.find("input[name='password']").setValue("password")
        wrapper.find("input[name='password_confirmation']").setValue("password")
        await wrapper.vm.passwordReset()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをした
        expect(passwordResetValidate).toHaveBeenCalled()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()
        expect(axiosPost).toHaveBeenCalledWith("/api/password/reset", {
          email: "test@test.com",
          password: "password",
          password_confirmation: "password",
          token: "test"
        })
        expect(axiosGet).toHaveBeenCalled()
        expect(axiosGet).toHaveBeenCalledWith("/api/user")

        // ログインページへリダイレクトした
        expect(routerPush).toHaveBeenCalled()
        expect(routerPush).toHaveBeenCalledWith("/")

        // snackbarの完了表示
        expect(wrapper.vm.$snackbar.text).toBe("パスワードリセットしました。")
        expect(wrapper.vm.$snackbar.options.color).toBe("success")
      })

      test("loading中はパスワードリセット不可", async () => {
        // spyOn
        const passwordResetValidate = jest.spyOn(
          wrapper.vm.$refs.passwordResetValidate,
          "validate"
        )

        // loading中の設定
        wrapper.setData({
          loading: true
        })

        // パスワードリセット処理
        await wrapper.vm.passwordReset()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをしない
        expect(passwordResetValidate).not.toHaveBeenCalled()
      })
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let passwordReset
    beforeEach(() => {
      passwordReset = jest
        .spyOn(Token.methods, "passwordReset")
        .mockReturnValue(true)
      wrapper = mount(Token, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test("パスワードリセットボタン", () => {
      // ボタンをクリック
      wrapper.find("[data-test='passwordResetButton']").trigger("click")

      // メソッドが実行されたか
      expect(passwordReset).toHaveBeenCalled()
    })
  })
})
