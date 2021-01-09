import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import axios from "axios"
import Api from "@/test/api"
import storeConfig from "@/test/storeConfig"
import setInject from "@/test/setInject"
import * as types from "@/store/mutation-types"
import setConfigData from "@/test/setConfigData"
import PasswordChangeDialog from "@/components/layouts/default/dialogs/passwordChangeDialog"

const localVue = createLocalVue()
localVue.use(Vuex)

const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/" + types.CONFIG_SET_CONFIG, setConfigData)
  const apiClass = new Api({ axios, store })
  localVue.prototype.$api = apiClass
  setInject(localVue)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/layouts/default/dialogs/passwordChangeDialog", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordChangeDialog, {
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
      wrapper = mount(PasswordChangeDialog, {
        localVue,
        store,
        vuetify
      })
    })

    describe("パスワード変更", () => {
      let validate
      let axiosPatch
      beforeEach(async () => {
        // ダイアログを開く
        wrapper.vm.openDialog()

        // spyOn
        validate = jest.spyOn(wrapper.vm.$refs.validate, "validate")
        axiosPatch = jest.spyOn(axios, "patch")
      })

      describe("失敗", () => {
        beforeEach(() => {
          // エラーレスポンス
          const response = {
            status: 422,
            data: {}
          }
          // axiosのレスポンスをモックする
          axios.patch.mockImplementation(url => {
            return Promise.resolve(response)
          })
        })
        test("フロント側エラー", async () => {
          // フォームを空にしてパスワード変更処理
          wrapper.find("input[name='current_password']").setValue("")
          wrapper.find("input[name='password']").setValue("")
          wrapper.find("input[name='password_confirmation']").setValue("")
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(validate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.validate.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPatch).not.toHaveBeenCalled()
        })

        describe("API側エラー", () => {
          test("error_messageなし", async () => {
            // エラーレスポンス
            const response = {
              status: 422,
              data: {}
            }
            // axiosのレスポンスをモックする
            axios.patch.mockImplementation(url => {
              return Promise.resolve(response)
            })

            // フォームを入力してパスワード変更処理
            wrapper
              .find("input[name='current_password']")
              .setValue("currentpass")
            wrapper.find("input[name='password']").setValue("changepass")
            wrapper
              .find("input[name='password_confirmation']")
              .setValue("changepass")
            await wrapper.vm.submit()
            jest.runAllTimers()
            await wrapper.vm.$nextTick()

            // バリデーションチェックをした
            expect(validate).toHaveBeenCalled()

            // API送信をした
            expect(axiosPatch).toHaveBeenCalled()
            expect(axiosPatch).toHaveBeenCalledWith(
              "/api/myuser/passwordChange",
              {
                current_password: "currentpass",
                password: "changepass",
                password_confirmation: "changepass"
              }
            )

            // snackbarのエラー表示
            expect(wrapper.vm.$snackbar.text).toBe(
              "パスワードの変更に失敗しました。"
            )
            expect(wrapper.vm.$snackbar.options.color).toBe("error")
          })

          test("error_messageあり", async () => {
            // エラーレスポンス
            const response = {
              status: 422,
              data: {
                error_message: "エラーメッセージ"
              }
            }
            // axiosのレスポンスをモックする
            axios.patch.mockImplementation(url => {
              return Promise.resolve(response)
            })

            // フォームを入力してパスワード変更処理
            wrapper
              .find("input[name='current_password']")
              .setValue("currentpass")
            wrapper.find("input[name='password']").setValue("changepass")
            wrapper
              .find("input[name='password_confirmation']")
              .setValue("changepass")
            await wrapper.vm.submit()
            jest.runAllTimers()
            await wrapper.vm.$nextTick()

            // バリデーションチェックをした
            expect(validate).toHaveBeenCalled()

            // API送信をした
            expect(axiosPatch).toHaveBeenCalled()
            expect(axiosPatch).toHaveBeenCalledWith(
              "/api/myuser/passwordChange",
              {
                current_password: "currentpass",
                password: "changepass",
                password_confirmation: "changepass"
              }
            )

            // snackbarのエラー表示
            expect(wrapper.vm.$snackbar.text).toBe("エラーメッセージ")
            expect(wrapper.vm.$snackbar.options.color).toBe("error")
          })
        })
      })

      test("成功", async () => {
        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.patch.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // フォームを入力してパスワード変更処理
        wrapper.find("input[name='current_password']").setValue("currentpass")
        wrapper.find("input[name='password']").setValue("changepass")
        wrapper
          .find("input[name='password_confirmation']")
          .setValue("changepass")
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをした
        expect(validate).toHaveBeenCalled()

        // API送信をした
        expect(axiosPatch).toHaveBeenCalled()
        expect(axiosPatch).toHaveBeenCalledWith("/api/myuser/passwordChange", {
          current_password: "currentpass",
          password: "changepass",
          password_confirmation: "changepass"
        })

        // snackbarの完了表示
        expect(wrapper.vm.$snackbar.text).toBe("パスワードを変更しました。")
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
        axios.patch.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // フォームを入力してパスワード変更処理
        wrapper.find("input[name='current_password']").setValue("currentpass")
        wrapper.find("input[name='password']").setValue("changepass")
        wrapper
          .find("input[name='password_confirmation']")
          .setValue("changepass")
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // API送信をしない
        expect(axiosPatch).not.toHaveBeenCalled()
      })
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let submit
    beforeEach(() => {
      submit = jest
        .spyOn(PasswordChangeDialog.methods, "submit")
        .mockReturnValue(true)
      wrapper = mount(PasswordChangeDialog, {
        localVue,
        store,
        vuetify
      })
    })

    test("パスワード変更ボタン", async () => {
      // ダイアログを開く
      await wrapper.setData({ dialog: true })

      // ボタンをクリック
      wrapper.find("[data-test='submitButton']").trigger("click")

      // メソッドが実行されたか
      expect(submit).toHaveBeenCalled()
    })
  })
})
