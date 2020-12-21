import { createLocalVue, mount, RouterLinkStub } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import VueRouter from "vue-router"
import axios from "axios"
import storeConfig from "@/test/storeConfig"
import Login from "@/components/login/login"

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/login/login", () => {
  describe("mount", () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()
      wrapper = mount(Login, {
        localVue,
        store,
        router,
        vuetify,
        sync: false,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    describe("ログイン", () => {
      let loginFormValidation
      let axiosPost
      beforeEach(() => {
        // spyOn
        loginFormValidation = jest.spyOn(wrapper.vm.$refs.loginForm, "validate")
        axiosPost = jest.spyOn(axios, "post")
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
          wrapper.vm.$store.$axios = axios
        })

        test("フロント側エラー", async () => {
          // ログイン処理
          await wrapper.vm.submit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(loginFormValidation).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.loginForm.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPost).not.toHaveBeenCalled()
        })

        test("API側エラー", async () => {
          // フォームを入力してログイン処理
          wrapper.find("input[name='login']").setValue("test@test.com")
          wrapper.find("input[name='password']").setValue("password")
          await wrapper.vm.submit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(loginFormValidation).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith("/api/login", {
            email: "test@test.com",
            password: "password"
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
            "認証に失敗しました。"
          )
          expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
            "error"
          )
        })
      })

      test("成功", async () => {
        // spyOn
        const routerPush = jest.spyOn(wrapper.vm.$router, "push")

        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.post.mockImplementation(url => {
          return Promise.resolve(response)
        })
        wrapper.vm.$store.$axios = axios

        // フォームを入力してログイン処理
        wrapper.find("input[name='login']").setValue("test@test.com")
        wrapper.find("input[name='password']").setValue("password")
        await wrapper.vm.submit()
        jest.runAllTimers()

        // バリデーションチェックをした
        expect(loginFormValidation).toHaveBeenCalled()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()
        expect(axiosPost).toHaveBeenCalledWith("/api/login", {
          email: "test@test.com",
          password: "password"
        })

        // Topへリダイレクトした
        expect(routerPush).toHaveBeenCalled()
        expect(routerPush).toHaveBeenCalledWith("/")
      })

      test("loading中はログイン処理不可", async () => {
        // loading中の設定
        wrapper.setData({
          loading: true
        })

        // ログイン処理
        await wrapper.vm.submit()
        jest.runAllTimers()

        // バリデーションチェックをしない
        expect(loginFormValidation).not.toHaveBeenCalled()
      })
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let submit
    beforeEach(() => {
      submit = jest.spyOn(Login.methods, "submit").mockReturnValue(true)
      wrapper = mount(Login, {
        localVue,
        store,
        router,
        vuetify,
        sync: false,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
    })

    test("ログインボタン", () => {
      // ボタンをクリック
      wrapper.find("[data-test='loginButton']").trigger("click")

      // メソッドが実行されたか
      expect(submit).toHaveBeenCalled()
    })
  })

  describe("リンク動作テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(Login, {
        localVue,
        store,
        router,
        vuetify,
        sync: false,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
    })

    test("トップボタンリンク", () => {
      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='topButtonLink']").props().to).toBe("/")
    })

    test("パスワードリセットリンク", () => {
      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='passwordResetLink']").props().to).toBe(
        "passwordReset"
      )
    })
  })
})
