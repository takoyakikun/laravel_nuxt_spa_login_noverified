import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import axios from "axios"
import api from "~/test/api"
import setPlugin from "~/test/setPlugin"
import storeConfig from "~/test/storeConfig"
import * as types from "~/store/mutation-types"
import setConfigData from "~/test/setConfigData"
import PasswordSetResendDialog from "~/components/users/dialogs/passwordSetResendDialog"

const localVue = createLocalVue()
localVue.use(Vuex)

const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/" + types.CONFIG_SET_CONFIG, setConfigData)
  localVue.prototype.$api = api({ $axios: axios, store })
  setPlugin(localVue)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/users/dialogs/passwordSetResendDialog", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordSetResendDialog, {
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
      wrapper = mount(PasswordSetResendDialog, {
        localVue,
        store,
        vuetify
      })
    })

    describe("パスワード設定メール再送信", () => {
      const passwordSetResendUser = {
        id: 1,
        name: "テスト",
        email: "test@test.com",
        role: 3,
        password_set_flg: 0
      }

      let axiosPost
      beforeEach(() => {
        // spyOn
        axiosPost = jest.spyOn(axios, "post")

        // ダイアログを開く
        wrapper.vm.openDialog(passwordSetResendUser)
      })

      test("失敗", async () => {
        // エラーレスポンス
        const response = {
          status: 403
        }
        // axiosのレスポンスをモックする
        axios.post.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // パスワード設定メール再送信
        await wrapper.vm.submit()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()

        // snackbarのエラー表示
        expect(wrapper.vm.$snackbar.text).toBe(
          "パスワード設定メールの再送信に失敗しました。"
        )
        expect(wrapper.vm.$snackbar.options.color).toBe("error")
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

        // パスワード設定メール再送信
        await wrapper.vm.submit()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()

        // snackbarの完了表示
        expect(wrapper.vm.$snackbar.text).toBe(
          "パスワード設定メールを再送信しました。"
        )
        expect(wrapper.vm.$snackbar.options.color).toBe("success")
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

        // パスワード設定メール再送信
        await wrapper.vm.submit()

        // API送信をしない
        expect(axiosPost).not.toHaveBeenCalled()
      })
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let submit
    beforeEach(() => {
      submit = jest
        .spyOn(PasswordSetResendDialog.methods, "submit")
        .mockReturnValue(true)
      wrapper = mount(PasswordSetResendDialog, {
        localVue,
        store,
        vuetify
      })
    })

    test("パスワード設定メール再送信ボタン", async () => {
      // ダイアログを開く
      await wrapper.vm.$refs.dialog.openDialog()

      // ボタンをクリック
      wrapper.find("[data-test='submitButton']").trigger("click")

      // メソッドが実行されたか
      expect(submit).toHaveBeenCalled()
    })
  })
})
