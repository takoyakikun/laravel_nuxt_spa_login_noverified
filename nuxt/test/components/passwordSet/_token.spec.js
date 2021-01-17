import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import VueRouter from "vue-router"
import axios from "axios"
import api from "~/test/api"
import setPlugin from "~/test/setPlugin"
import storeConfig from "~/test/storeConfig"
import Token from "~/components/passwordSet/_token"

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  localVue.prototype.$api = api({ $axios: axios, store })
  setPlugin(localVue)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/passwordSet/_token", () => {
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

  describe("フォーム送信テスト", () => {
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

    describe("パスワード登録", () => {
      let passwordSetValidate
      let axiosPost, axiosGet
      let routerPush
      beforeEach(async () => {
        // spyOn
        passwordSetValidate = jest.spyOn(
          wrapper.vm.$refs.passwordSetValidate,
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
          // パスワード登録処理
          await wrapper.vm.passwordSet()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(passwordSetValidate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.passwordSetValidate.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPost).not.toHaveBeenCalled()
        })

        test("API側エラー", async () => {
          // フォームを入力してパスワード登録処理
          wrapper.find("input[name='email']").setValue("test@test.com")
          wrapper.find("input[name='password']").setValue("password")
          wrapper
            .find("input[name='password_confirmation']")
            .setValue("password")
          await wrapper.vm.passwordSet()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(passwordSetValidate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith("/api/password/passwordSet", {
            email: "test@test.com",
            password: "password",
            password_confirmation: "password",
            token: "test"
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$snackbar.text).toBe(
            "パスワードの登録に失敗しました。"
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

        // フォームを入力してパスワード登録処理
        wrapper.find("input[name='email']").setValue("test@test.com")
        wrapper.find("input[name='password']").setValue("password")
        wrapper.find("input[name='password_confirmation']").setValue("password")
        await wrapper.vm.passwordSet()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをした
        expect(passwordSetValidate).toHaveBeenCalled()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()
        expect(axiosPost).toHaveBeenCalledWith("/api/password/passwordSet", {
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
        expect(wrapper.vm.$snackbar.text).toBe("パスワードを登録しました。")
        expect(wrapper.vm.$snackbar.options.color).toBe("success")
      })

      test("loading中はパスワード登録不可", async () => {
        // loading中の設定
        wrapper.setData({
          loading: true
        })

        // パスワード登録処理
        await wrapper.vm.passwordSet()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをしない
        expect(passwordSetValidate).not.toHaveBeenCalled()
      })
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let passwordSet
    beforeEach(() => {
      passwordSet = jest
        .spyOn(Token.methods, "passwordSet")
        .mockReturnValue(true)
      wrapper = mount(Token, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test("パスワード登録ボタン", () => {
      // ボタンをクリック
      wrapper.find("[data-test='passwordSetButton']").trigger("click")

      // メソッドが実行されたか
      expect(passwordSet).toHaveBeenCalled()
    })
  })
})
