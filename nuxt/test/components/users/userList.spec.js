import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import axios from "axios"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import UserList from "@/components/users/userList"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

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

describe("components/users/userList", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(async () => {
      wrapper = shallowMount(UserList, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    describe("自ユーザーかどうか", () => {
      beforeEach(() => {
        // ログインデータを登録
        wrapper.vm.$store.commit("auth/setUser", { id: 1 })
      })

      test("自ユーザー", () => {
        // 自ユーザーはtrueを返す
        wrapper.vm.editId = 1
        expect(wrapper.vm.myuser).toBeTruthy()
      })
      test("それ以外", () => {
        // それ以外はfalseを返す
        wrapper.vm.editId = 2
        expect(wrapper.vm.myuser).toBeFalsy()
      })
    })
  })

  describe("フォーム動作テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(UserList, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    describe("ユーザー追加", () => {
      let createFormValidate
      let axiosPost
      beforeEach(() => {
        // spyOn
        createFormValidate = jest.spyOn(wrapper.vm.$refs.createForm, "validate")
        axiosPost = jest.spyOn(axios, "post")

        // ダイアログを開く
        wrapper.vm.openCreateDialog()
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
          await wrapper.vm.createSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(createFormValidate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.createForm.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPost).not.toHaveBeenCalled()
        })

        test("API側エラー", async () => {
          // フォームを入力してユーザー追加処理
          wrapper.find("input[name='name']").setValue("テスト")
          wrapper.find("input[name='email']").setValue("test@test.com")
          wrapper.find("input[name='role'][value='3']").setChecked()
          await wrapper.vm.createSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(createFormValidate).toHaveBeenCalled()

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
        await wrapper.vm.createSubmit()
        jest.runAllTimers()

        // バリデーションチェックをした
        expect(createFormValidate).toHaveBeenCalled()

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
    })

    describe("ユーザー編集", () => {
      const editUser = {
        id: 1,
        name: "テスト",
        email: "test@test.com",
        role: 3,
        modify_flg: 1
      }

      let editFormValidate
      let axiosPatch
      beforeEach(() => {
        // spyOn
        editFormValidate = jest.spyOn(wrapper.vm.$refs.editForm, "validate")
        axiosPatch = jest.spyOn(axios, "patch")

        // ダイアログを開く
        wrapper.vm.openEditDialog(editUser)
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
            Object.keys(wrapper.vm.$refs.editForm.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPatch).not.toHaveBeenCalled()
        })

        test("API側エラー", async () => {
          // フォームを入力してユーザー編集処理
          wrapper.find("input[name='name']").setValue("テスト")
          wrapper.find("input[name='email']").setValue("test@test.com")
          wrapper.find("input[name='role'][value='3']").setChecked()
          await wrapper.vm.editSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(editFormValidate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPatch).toHaveBeenCalled()
          expect(axiosPatch).toHaveBeenCalledWith("/api/users/1", editUser)

          // snackbarのエラー表示
          expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
            "ユーザーデータの更新に失敗しました。"
          )
          expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
            "error"
          )
        })
      })
      describe("成功", () => {
        beforeEach(() => {
          // 正常なレスポンス
          const response = {
            status: 200
          }
          // axiosのレスポンスをモックする
          axios.patch.mockImplementation(url => {
            return Promise.resolve(response)
          })
          wrapper.vm.$store.$axios = axios
        })

        test("自ユーザー", async () => {
          // ログインデータを登録
          wrapper.vm.$store.commit("auth/setUser", { id: 1 })

          // フォームを入力してユーザー編集処理
          wrapper.find("input[name='name']").setValue("テスト")
          wrapper.find("input[name='email']").setValue("test@test.com")
          wrapper.find("input[name='role'][value='3']").setChecked()
          await wrapper.vm.editSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(editFormValidate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPatch).toHaveBeenCalled()
          expect(axiosPatch).toHaveBeenCalledWith(
            "/api/myuser/update",
            editUser
          )

          // snackbarの完了表示
          expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
            "ユーザーデータを更新しました。"
          )
          expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
            "success"
          )
        })

        test("それ以外", async () => {
          // フォームを入力してユーザー編集処理
          wrapper.find("input[name='name']").setValue("テスト")
          wrapper.find("input[name='email']").setValue("test@test.com")
          wrapper.find("input[name='role'][value='3']").setChecked()
          await wrapper.vm.editSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(editFormValidate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPatch).toHaveBeenCalled()
          expect(axiosPatch).toHaveBeenCalledWith("/api/users/1", editUser)

          // snackbarの完了表示
          expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
            "ユーザーデータを更新しました。"
          )
          expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
            "success"
          )
        })
      })
    })

    describe("ユーザー削除", () => {
      const deleteUser = {
        id: 1,
        name: "テスト",
        email: "test@test.com",
        role: 3,
        delete_flg: 1
      }

      let axiosDelete
      beforeEach(() => {
        // spyOn
        axiosDelete = jest.spyOn(axios, "delete")

        // ダイアログを開く
        wrapper.vm.openDeleteDialog(deleteUser)
      })

      test("失敗", async () => {
        // エラーレスポンス
        const response = {
          status: 422
        }
        // axiosのレスポンスをモックする
        axios.delete.mockImplementation(url => {
          return Promise.resolve(response)
        })
        wrapper.vm.$store.$axios = axios

        // ユーザー削除処理
        await wrapper.vm.deleteSubmit()

        // API送信をした
        expect(axiosDelete).toHaveBeenCalled()
        expect(axiosDelete).toHaveBeenCalledWith("/api/users/1")

        // snackbarのエラー表示
        expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
          "ユーザーデータの削除に失敗しました。"
        )
        expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
          "error"
        )
      })

      test("ユーザー削除成功", async () => {
        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.delete.mockImplementation(url => {
          return Promise.resolve(response)
        })
        wrapper.vm.$store.$axios = axios

        // ユーザー削除処理
        await wrapper.vm.deleteSubmit()

        // API送信をした
        expect(axiosDelete).toHaveBeenCalled()
        expect(axiosDelete).toHaveBeenCalledWith("/api/users/1")

        // snackbarの完了表示
        expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
          "ユーザーデータを削除しました。"
        )
        expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
          "success"
        )
      })
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let openCreateDialog
    let createSubmit
    let openEditDialog
    let editSubmit
    let openDeleteDialog
    let deleteSubmit
    beforeEach(() => {
      openCreateDialog = jest
        .spyOn(UserList.methods, "openCreateDialog")
        .mockReturnValue(true)
      createSubmit = jest
        .spyOn(UserList.methods, "createSubmit")
        .mockReturnValue(true)
      openEditDialog = jest
        .spyOn(UserList.methods, "openEditDialog")
        .mockReturnValue(true)
      editSubmit = jest
        .spyOn(UserList.methods, "editSubmit")
        .mockReturnValue(true)
      openDeleteDialog = jest
        .spyOn(UserList.methods, "openDeleteDialog")
        .mockReturnValue(true)
      deleteSubmit = jest
        .spyOn(UserList.methods, "deleteSubmit")
        .mockReturnValue(true)
      wrapper = mount(UserList, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    test("新規追加ダイアログボタン", () => {
      // ボタンをクリック
      wrapper.find("[data-test='createDialogButton']").trigger("click")

      // メソッドが実行されたか
      expect(openCreateDialog).toHaveBeenCalled()
    })

    test("新規追加ボタン", async () => {
      // ダイアログを開く
      await wrapper.setData({ createDialog: true })

      // ボタンをクリック
      wrapper.find("[data-test='createSubmitButton']").trigger("click")

      // メソッドが実行されたか
      expect(createSubmit).toHaveBeenCalled()
    })

    test("編集ダイアログボタン", async () => {
      // テーブルにデータを追加
      await wrapper.vm.$store.commit("users/setList", [
        {
          id: 1,
          name: "テスト",
          email: "test@test.com",
          role: 3,
          modify_flg: 1
        }
      ])

      // ボタンをクリック
      wrapper.find("[data-test='editDialogButton']").trigger("click")

      // メソッドが実行されたか
      expect(openEditDialog).toHaveBeenCalled()
    })

    test("更新ボタン", async () => {
      // ダイアログを開く
      await wrapper.setData({ editDialog: true })

      // ボタンをクリック
      wrapper.find("[data-test='editSubmitButton']").trigger("click")

      // メソッドが実行されたか
      expect(editSubmit).toHaveBeenCalled()
    })

    test("削除ダイアログボタン", async () => {
      // テーブルにデータを追加
      await wrapper.vm.$store.commit("users/setList", [
        {
          id: 1,
          name: "テスト",
          email: "test@test.com",
          role: 3,
          delete_flg: 1
        }
      ])

      // ボタンをクリック
      wrapper.find("[data-test='deleteDialogButton']").trigger("click")

      // メソッドが実行されたか
      expect(openDeleteDialog).toHaveBeenCalled()
    })

    test("削除ボタン", async () => {
      // ダイアログを開く
      await wrapper.setData({ deleteDialog: true })

      // ボタンをクリック
      wrapper.find("[data-test='deleteSubmitButton']").trigger("click")

      // メソッドが実行されたか
      expect(deleteSubmit).toHaveBeenCalled()
    })
  })

  describe("ユーザー検索動作テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(UserList, {
        localVue,
        store,
        vuetify,
        sync: false
      })

      // テーブルにデータを追加
      wrapper.vm.$store.commit("users/setList", [
        {
          id: 1,
          name: "テスト開発者",
          email: "test_system@test.com",
          role: 1
        },
        {
          id: 2,
          name: "テスト管理者",
          email: "test_admin@test.com",
          role: 2
        },
        {
          id: 3,
          name: "テスト一般",
          email: "test_user@test.com",
          role: 3
        },
        {
          id: 4,
          name: "一般",
          email: "user@test.com",
          role: 3
        }
      ])
    })

    test("ユーザー名検索", () => {
      let expects, results

      // 初期状態は全て表示
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchName(user.name))
      }
      expect(results).toEqual(expects)

      // 空文字の場合は全て表示
      wrapper.setData({ search: { name: "" } })
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchName(user.name))
      }
      expect(results).toEqual(expects)

      // 'テスト開発者'で検索
      wrapper.setData({ search: { name: "テスト開発者" } })
      expects = [true, false, false, false]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchName(user.name))
      }
      expect(results).toEqual(expects)

      // 'テスト'で検索
      wrapper.setData({ search: { name: "テスト" } })
      expects = [true, true, true, false]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchName(user.name))
      }
      expect(results).toEqual(expects)
    })

    test("メールアドレス検索", () => {
      let expects, results

      // 初期状態は全て表示
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchEmail(user.email))
      }
      expect(results).toEqual(expects)

      // 空文字の場合は全て表示
      wrapper.setData({ search: { email: "" } })
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchEmail(user.email))
      }
      expect(results).toEqual(expects)

      // 'test_system@test.com'で検索
      wrapper.setData({ search: { email: "test_system@test.com" } })
      expects = [true, false, false, false]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchEmail(user.email))
      }
      expect(results).toEqual(expects)

      // 'user'で検索
      wrapper.setData({ search: { email: "user" } })
      expects = [false, false, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchEmail(user.email))
      }
      expect(results).toEqual(expects)
    })

    test("アクセス権限検索", () => {
      let expects, results

      // 初期状態は全て表示
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchRole(user.role))
      }
      expect(results).toEqual(expects)

      // 未選択の場合は全て表示
      wrapper.setData({ search: { role: {} } })
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchRole(user.role))
      }
      expect(results).toEqual(expects)

      // '開発者'で検索
      wrapper.setData({ search: { role: [{ value: 1 }] } })
      expects = [true, false, false, false]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchRole(user.role))
      }
      expect(results).toEqual(expects)

      // '管理者','一般'で検索
      wrapper.setData({ search: { role: [{ value: 2 }, { value: 3 }] } })
      expects = [false, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchRole(user.role))
      }
      expect(results).toEqual(expects)
    })
  })
})
