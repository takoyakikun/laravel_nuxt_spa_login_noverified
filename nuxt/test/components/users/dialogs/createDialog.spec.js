import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import axios from "axios"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import CreateDialog from "@/components/users/dialogs/createDialog"

const localVue = createLocalVue()
localVue.use(Vuex)

const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/setConfig", setConfigData)
  store.commit("users/setRoleOptions", [1, 2, 3])
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/users/dialogs/createDialog", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(CreateDialog, {
        localVue,
        store,
        vuetify
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe("フォーム動作テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(CreateDialog, {
        localVue,
        store,
        vuetify
      })
    })

    describe("ユーザー追加", () => {
      let validate
      let axiosPost
      beforeEach(() => {
        // spyOn
        validate = jest.spyOn(wrapper.vm.$refs.validate, "validate")
        axiosPost = jest.spyOn(axios, "post")

        // ダイアログを開く
        wrapper.vm.openDialog()
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
          // ユーザー追加処理
          await wrapper.vm.submit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(validate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.validate.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPost).not.toHaveBeenCalled()
        })

        test("API側エラー", async () => {
          // フォームを入力してユーザー追加処理
          wrapper.find("input[name='name']").setValue("テスト")
          wrapper.find("input[name='email']").setValue("test@test.com")
          wrapper.find("input[name='role'][value='3']").setChecked()
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(validate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith("/api/users", {
            name: "テスト",
            email: "test@test.com",
            role: 3
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
            "ユーザーデータの追加に失敗しました。"
          )
          expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
            "error"
          )
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
        wrapper.vm.$store.$axios = axios

        // フォームを入力してユーザー追加処理
        wrapper.find("input[name='name']").setValue("テスト")
        wrapper.find("input[name='email']").setValue("test@test.com")
        wrapper.find("input[name='role'][value='3']").setChecked()
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをした
        expect(validate).toHaveBeenCalled()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()
        expect(axiosPost).toHaveBeenCalledWith("/api/users", {
          name: "テスト",
          email: "test@test.com",
          role: 3
        })

        // snackbarの完了表示
        expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
          "ユーザーデータを追加しました。"
        )
        expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
          "success"
        )
      })

      test("loading中は処理不可", async () => {
        // loading中の設定
        wrapper.setData({
          loading: true
        })
        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.post.mockImplementation(url => {
          return Promise.resolve(response)
        })
        wrapper.vm.$store.$axios = axios

        // フォームを入力してユーザー追加処理
        wrapper.find("input[name='name']").setValue("テスト")
        wrapper.find("input[name='email']").setValue("test@test.com")
        wrapper.find("input[name='role'][value='3']").setChecked()
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // API送信をしない
        expect(axiosPost).not.toHaveBeenCalled()
      })
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let submit
    beforeEach(() => {
      submit = jest.spyOn(CreateDialog.methods, "submit").mockReturnValue(true)
      wrapper = mount(CreateDialog, {
        localVue,
        store,
        vuetify
      })
    })

    test("追加ボタン", async () => {
      // ダイアログを開く
      await wrapper.setData({ dialog: true })

      // ボタンをクリック
      wrapper.find("[data-test='submitButton']").trigger("click")

      // メソッドが実行されたか
      expect(submit).toHaveBeenCalled()
    })
  })
})
