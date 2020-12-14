import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
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
        vuetify
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe("ダイアログオープンテスト", () => {
    let wrapper
    let testUser
    beforeEach(() => {
      wrapper = mount(UserList, {
        localVue,
        store,
        vuetify
      })

      testUser = {
        id: 1,
        name: "テスト",
        email: "test@test.com",
        role: 3,
        modify_flg: 1
      }
    })

    test("新規追加ダイアログを開く", () => {
      // ダイアログを開く
      wrapper.vm.openCreateDialog()

      // ダイアログが開いている
      expect(wrapper.vm.$refs.createDialog.dialog).toBeTruthy()
    })

    test("編集ダイアログを開く", () => {
      // ダイアログを開く
      wrapper.vm.openEditDialog(testUser)

      // ダイアログが開いている
      expect(wrapper.vm.$refs.editDialog.dialog).toBeTruthy()

      // 正しいユーザーデータが入っている
      expect(wrapper.vm.$refs.editDialog.formValue).toEqual(testUser)

      // 正しいユーザーIDが入っている
      expect(wrapper.vm.$refs.editDialog.editId).toEqual(testUser.id)
    })

    test("削除ダイアログを開く", () => {
      // ダイアログを開く
      wrapper.vm.openDeleteDialog(testUser)

      // ダイアログが開いている
      expect(wrapper.vm.$refs.deleteDialog.dialog).toBeTruthy()

      // 正しいユーザーデータが入っている
      expect(wrapper.vm.$refs.deleteDialog.userData).toEqual(testUser)
    })

    test("パスワード設定メール再送信ダイアログを開く", () => {
      // ダイアログを開く
      wrapper.vm.openPasswordSetResendDialog(testUser)

      // ダイアログが開いている
      expect(wrapper.vm.$refs.passwordSetResendDialog.dialog).toBeTruthy()

      // 正しいユーザーデータが入っている
      expect(wrapper.vm.$refs.passwordSetResendDialog.userData).toEqual(
        testUser
      )
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let openCreateDialog
    let openEditDialog
    let openDeleteDialog
    let openPasswordSetResendDialog
    beforeEach(() => {
      openCreateDialog = jest
        .spyOn(UserList.methods, "openCreateDialog")
        .mockReturnValue(true)
      openEditDialog = jest
        .spyOn(UserList.methods, "openEditDialog")
        .mockReturnValue(true)
      openDeleteDialog = jest
        .spyOn(UserList.methods, "openDeleteDialog")
        .mockReturnValue(true)
      openPasswordSetResendDialog = jest
        .spyOn(UserList.methods, "openPasswordSetResendDialog")
        .mockReturnValue(true)
      wrapper = mount(UserList, {
        localVue,
        store,
        vuetify
      })
    })

    test("新規追加ダイアログボタン", () => {
      // ボタンをクリック
      wrapper.find("[data-test='createDialogButton']").trigger("click")

      // メソッドが実行されたか
      expect(openCreateDialog).toHaveBeenCalled()
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

    test("パスワード設定メール再送信ダイアログボタン", async () => {
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
      wrapper.find("[data-test='passwordSetResendDialog']").trigger("click")

      // メソッドが実行されたか
      expect(openPasswordSetResendDialog).toHaveBeenCalled()
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
