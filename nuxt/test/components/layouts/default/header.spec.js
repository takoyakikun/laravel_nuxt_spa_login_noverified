import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import VueRouter from "vue-router"
import axios from "axios"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import Header from "@/components/layouts/default/header"

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/setConfig", setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/layouts/default/header", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()

      wrapper = shallowMount(Header, {
        localVue,
        store,
        router,
        vuetify,
        sync: false,
        propsData: {
          drawer: false
        }
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    describe("サイドバーの表示切り替え", () => {
      test("閉から開", () => {
        // 初期値はfalse
        expect(wrapper.vm.dataDrawer).toBeFalsy()

        // サイドバーの表示切り替え処理
        wrapper.vm.toggleDrawer()

        // trueに切り替わる
        expect(wrapper.vm.dataDrawer).toBeTruthy()

        // trueをemitする
        expect(wrapper.emitted().drawer[0][0]).toBeTruthy()
      })

      test("開から閉", () => {
        // 初期値をtrueにする
        wrapper.setData({ dataDrawer: true })
        expect(wrapper.vm.dataDrawer).toBeTruthy()

        // サイドバーの表示切り替え処理
        wrapper.vm.toggleDrawer()

        // falseに切り替わる
        expect(wrapper.vm.dataDrawer).toBeFalsy()

        // falseをemitする
        expect(wrapper.emitted().drawer[0][0]).toBeFalsy()
      })
    })

    test("ログアウト", async () => {
      // spyOn
      const axiosPost = jest.spyOn(axios, "post")
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

      // ログアウト処理
      await wrapper.vm.logout()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith("/api/logout")

      // Topへリダイレクトした
      expect(routerPush).toHaveBeenCalled()
      expect(routerPush).toHaveBeenCalledWith("/")
    })
  })

  describe("フォーム動作テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(Header, {
        localVue,
        store,
        router,
        vuetify,
        sync: false,
        propsData: {
          drawer: false
        }
      })
    })

    describe("ユーザー編集", () => {
      let editFormValidate
      let axiosPatch
      beforeEach(async () => {
        // ログインデータを登録
        await wrapper.vm.$store.commit("auth/setUser", { id: 1 })

        // ダイアログを開く
        wrapper.vm.openEditDialog()

        // spyOn
        editFormValidate = jest.spyOn(
          wrapper.vm.$refs.editFormValidate,
          "validate"
        )
        axiosPatch = jest.spyOn(axios, "patch")
      })

      describe("失敗", () => {
        beforeEach(() => {
          // エラーレスポンス
          const response = {
            status: 422
          }
          // axiosのレスポンスをモックする
          axios.patch.mockImplementation(url => {
            return Promise.resolve(response)
          })
          wrapper.vm.$store.$axios = axios
        })
        test("フロント側エラー", async () => {
          // フォームを空にしてユーザー編集処理
          wrapper.find("input[name='name']").setValue("")
          wrapper.find("input[name='email']").setValue("")
          await wrapper.vm.editSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(editFormValidate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.editFormValidate.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPatch).not.toHaveBeenCalled()
        })

        test("API側エラー", async () => {
          // フォームを入力してユーザー編集処理
          wrapper.find("input[name='name']").setValue("テスト")
          wrapper.find("input[name='email']").setValue("test@test.com")
          await wrapper.vm.editSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(editFormValidate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPatch).toHaveBeenCalled()
          expect(axiosPatch).toHaveBeenCalledWith("/api/myuser/update", {
            id: 1,
            name: "テスト",
            email: "test@test.com"
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
            "ユーザーデータの更新に失敗しました。"
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
        axios.patch.mockImplementation(url => {
          return Promise.resolve(response)
        })
        wrapper.vm.$store.$axios = axios

        // フォームを入力してユーザー編集処理
        wrapper.find("input[name='name']").setValue("テスト")
        wrapper.find("input[name='email']").setValue("test@test.com")
        await wrapper.vm.editSubmit()
        jest.runAllTimers()

        // バリデーションチェックをした
        expect(editFormValidate).toHaveBeenCalled()

        // API送信をした
        expect(axiosPatch).toHaveBeenCalled()
        expect(axiosPatch).toHaveBeenCalledWith("/api/myuser/update", {
          id: 1,
          name: "テスト",
          email: "test@test.com"
        })

        // snackbarの完了表示
        expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
          "ユーザーデータを更新しました。"
        )
        expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
          "success"
        )
      })

      test("loading中は処理不可", async () => {
        // loading中の設定
        wrapper.setData({
          editLoading: true
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

        // フォームを入力してユーザー編集処理
        wrapper.find("input[name='name']").setValue("テスト")
        wrapper.find("input[name='email']").setValue("test@test.com")
        await wrapper.vm.editSubmit()
        jest.runAllTimers()

        // API送信をしない
        expect(axiosPatch).not.toHaveBeenCalled()
      })
    })

    describe("パスワード変更", () => {
      let passwordChangeFormValidate
      let axiosPatch
      beforeEach(async () => {
        // ダイアログを開く
        wrapper.vm.openPasswordChangeDialog()

        // spyOn
        passwordChangeFormValidate = jest.spyOn(
          wrapper.vm.$refs.passwordChangeFormValidate,
          "validate"
        )
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
          wrapper.vm.$store.$axios = axios
        })
        test("フロント側エラー", async () => {
          // フォームを空にしてパスワード変更処理
          wrapper.find("input[name='current_password']").setValue("")
          wrapper.find("input[name='password']").setValue("")
          wrapper.find("input[name='password_confirmation']").setValue("")
          await wrapper.vm.passwordChangeSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(passwordChangeFormValidate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.passwordChangeFormValidate.errors)
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
            wrapper.vm.$store.$axios = axios

            // フォームを入力してパスワード変更処理
            wrapper
              .find("input[name='current_password']")
              .setValue("currentpass")
            wrapper.find("input[name='password']").setValue("changepass")
            wrapper
              .find("input[name='password_confirmation']")
              .setValue("changepass")
            await wrapper.vm.passwordChangeSubmit()
            jest.runAllTimers()

            // バリデーションチェックをした
            expect(passwordChangeFormValidate).toHaveBeenCalled()

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
            expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
              "パスワードの変更に失敗しました。"
            )
            expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
              "error"
            )
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
            wrapper.vm.$store.$axios = axios

            // フォームを入力してパスワード変更処理
            wrapper
              .find("input[name='current_password']")
              .setValue("currentpass")
            wrapper.find("input[name='password']").setValue("changepass")
            wrapper
              .find("input[name='password_confirmation']")
              .setValue("changepass")
            await wrapper.vm.passwordChangeSubmit()
            jest.runAllTimers()

            // バリデーションチェックをした
            expect(passwordChangeFormValidate).toHaveBeenCalled()

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
            expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
              "エラーメッセージ"
            )
            expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
              "error"
            )
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
        wrapper.vm.$store.$axios = axios

        // フォームを入力してパスワード変更処理
        wrapper.find("input[name='current_password']").setValue("currentpass")
        wrapper.find("input[name='password']").setValue("changepass")
        wrapper
          .find("input[name='password_confirmation']")
          .setValue("changepass")
        await wrapper.vm.passwordChangeSubmit()
        jest.runAllTimers()

        // バリデーションチェックをした
        expect(passwordChangeFormValidate).toHaveBeenCalled()

        // API送信をした
        expect(axiosPatch).toHaveBeenCalled()
        expect(axiosPatch).toHaveBeenCalledWith("/api/myuser/passwordChange", {
          current_password: "currentpass",
          password: "changepass",
          password_confirmation: "changepass"
        })

        // snackbarの完了表示
        expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
          "パスワードを変更しました。"
        )
        expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
          "success"
        )
      })

      test("loading中は処理不可", async () => {
        // loading中の設定
        wrapper.setData({
          passwordChangeLoading: true
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

        // フォームを入力してパスワード変更処理
        wrapper.find("input[name='current_password']").setValue("currentpass")
        wrapper.find("input[name='password']").setValue("changepass")
        wrapper
          .find("input[name='password_confirmation']")
          .setValue("changepass")
        await wrapper.vm.passwordChangeSubmit()
        jest.runAllTimers()

        // API送信をしない
        expect(axiosPatch).not.toHaveBeenCalled()
      })
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let openEditDialog
    let editSubmit
    let openPasswordChangeDialog
    let passwordChangeSubmit
    beforeEach(() => {
      openEditDialog = jest
        .spyOn(Header.methods, "openEditDialog")
        .mockReturnValue(true)
      editSubmit = jest
        .spyOn(Header.methods, "editSubmit")
        .mockReturnValue(true)
      openPasswordChangeDialog = jest
        .spyOn(Header.methods, "openPasswordChangeDialog")
        .mockReturnValue(true)
      passwordChangeSubmit = jest
        .spyOn(Header.methods, "passwordChangeSubmit")
        .mockReturnValue(true)
      wrapper = mount(Header, {
        localVue,
        store,
        router,
        vuetify,
        sync: false,
        propsData: {
          drawer: false
        }
      })
    })

    describe("マイユーザー管理メニュー", () => {
      beforeEach(async () => {
        // ログインデータを登録
        await wrapper.vm.$store.commit("auth/setUser", { id: 1 })

        // マイユーザー管理メニューを開く
        wrapper.find("[data-test='myuserMenuButton']").trigger("click")
      })

      test("編集ダイアログ項目", () => {
        // 項目をクリック
        wrapper.find("[data-test='editDialogItem']").vm.$emit("click")

        // メソッドが実行されたか
        expect(openEditDialog).toHaveBeenCalled()
      })

      test("パスワード変更ダイアログ項目", () => {
        // 項目をクリック
        wrapper.find("[data-test='passwordChangeDialogItem']").trigger("click")

        // メソッドが実行されたか
        expect(openPasswordChangeDialog).toHaveBeenCalled()
      })
    })

    test("更新ボタン", async () => {
      // ダイアログを開く
      await wrapper.setData({ editDialog: true })

      // ボタンをクリック
      wrapper.find("[data-test='editSubmitButton']").trigger("click")

      // メソッドが実行されたか
      expect(editSubmit).toHaveBeenCalled()
    })

    test("パスワード変更ボタン", async () => {
      // ダイアログを開く
      await wrapper.setData({ passwordChangeDialog: true })

      // ボタンをクリック
      wrapper.find("[data-test='passwordChangeSubmitButton']").trigger("click")

      // メソッドが実行されたか
      expect(passwordChangeSubmit).toHaveBeenCalled()
    })
  })

  describe("項目表示テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(Header, {
        localVue,
        store,
        router,
        vuetify,
        sync: false,
        propsData: {
          drawer: false
        }
      })
    })

    test("ログアウト", () => {
      // マイユーザー管理ボタン
      expect(
        wrapper.find("[data-test='myuserMenuButton']").exists()
      ).toBeFalsy()

      // ログアウトボタン
      expect(wrapper.find("[data-test='logoutButton']").exists()).toBeFalsy()

      // 新規作成ボタン
      expect(wrapper.find("[data-test='registerButton']").exists()).toBeTruthy()

      // ログインボタン
      expect(wrapper.find("[data-test='loginButton']").exists()).toBeTruthy()
    })

    test("一般権限", async () => {
      // ログインデータを追加
      await wrapper.vm.$store.commit("auth/setUser", {
        name: "テスト",
        email: "test@test.com",
        role: 3
      })

      // マイユーザー管理ボタン
      expect(
        wrapper.find("[data-test='myuserMenuButton']").exists()
      ).toBeTruthy()

      // マイユーザー管理メニューを開く
      await wrapper.find("[data-test='myuserMenuButton']").trigger("click")

      // マイユーザー編集項目
      expect(wrapper.find("[data-test='editDialogItem']").exists()).toBeTruthy()

      // パスワード変更項目
      expect(
        wrapper.find("[data-test='passwordChangeDialogItem']").exists()
      ).toBeTruthy()

      // ログアウトボタン
      expect(wrapper.find("[data-test='logoutButton']").exists()).toBeTruthy()

      // 新規作成ボタン
      expect(wrapper.find("[data-test='registerButton']").exists()).toBeFalsy()

      // ログインボタン
      expect(wrapper.find("[data-test='loginButton']").exists()).toBeFalsy()
    })

    test("管理者権限", async () => {
      // ログインデータを追加
      await wrapper.vm.$store.commit("auth/setUser", {
        name: "テスト",
        email: "test@test.com",
        role: 2
      })

      // 権限を管理者以上にする
      await wrapper.vm.$store.commit("auth/setPermission", {
        category: "admin-higher",
        permission: true
      })

      // マイユーザー管理ボタン
      expect(
        wrapper.find("[data-test='myuserMenuButton']").exists()
      ).toBeTruthy()

      // マイユーザー管理メニューを開く
      await wrapper.find("[data-test='myuserMenuButton']").trigger("click")

      // マイユーザー編集項目
      expect(wrapper.find("[data-test='editDialogItem']").exists()).toBeTruthy()

      // パスワード変更項目
      expect(
        wrapper.find("[data-test='passwordChangeDialogItem']").exists()
      ).toBeTruthy()

      // ログアウトボタン
      expect(wrapper.find("[data-test='logoutButton']").exists()).toBeTruthy()

      // 新規作成ボタン
      expect(wrapper.find("[data-test='registerButton']").exists()).toBeFalsy()

      // ログインボタン
      expect(wrapper.find("[data-test='loginButton']").exists()).toBeFalsy()
    })

    test("開発者権限", async () => {
      // ログインデータを追加
      await wrapper.vm.$store.commit("auth/setUser", {
        name: "テスト",
        email: "test@test.com",
        role: 1
      })

      // 権限を開発者にする
      await wrapper.vm.$store.commit("auth/setPermission", {
        category: "system-only",
        permission: true
      })

      // マイユーザー管理ボタン
      expect(
        wrapper.find("[data-test='myuserMenuButton']").exists()
      ).toBeTruthy()

      // マイユーザー管理メニューを開く
      await wrapper.find("[data-test='myuserMenuButton']").trigger("click")

      // マイユーザー編集項目
      expect(wrapper.find("[data-test='editDialogItem']").exists()).toBeTruthy()

      // パスワード変更項目
      expect(
        wrapper.find("[data-test='passwordChangeDialogItem']").exists()
      ).toBeTruthy()

      // ログアウトボタン
      expect(wrapper.find("[data-test='logoutButton']").exists()).toBeTruthy()

      // 新規作成ボタン
      expect(wrapper.find("[data-test='registerButton']").exists()).toBeFalsy()

      // ログインボタン
      expect(wrapper.find("[data-test='loginButton']").exists()).toBeFalsy()
    })
  })
})
