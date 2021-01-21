import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import VueRouter from "vue-router"
import axios from "axios"
import api from "~/test/api"
import storeConfig from "~/test/storeConfig"
import setPlugin from "~/test/setPlugin"
import * as types from "~/store/mutation-types"
import setConfigData from "~/test/setConfigData"
import Header from "~/components/layouts/default/header"

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/" + types.CONFIG_SET_CONFIG, setConfigData)
  localVue.prototype.$api = api({ $axios: axios, store })
  setPlugin(localVue)
  localVue.prototype.$nuxt.context.store = store
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()

      wrapper = shallowMount(Header, {
        localVue,
        store,
        router,
        vuetify
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

  describe("ダイアログオープンテスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(Header, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test("編集ダイアログを開く", () => {
      // ダイアログを開く
      wrapper.vm.openEditDialog()

      // ダイアログが開いている
      expect(wrapper.vm.$refs.editDialog.$refs.dialog.state.value).toBeTruthy()
    })

    test("パスワード変更ダイアログを開く", () => {
      // ダイアログを開く
      wrapper.vm.openPasswordChangeDialog()

      // ダイアログが開いている
      expect(
        wrapper.vm.$refs.passwordChangeDialog.$refs.dialog.state.value
      ).toBeTruthy()
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let openEditDialog
    let openPasswordChangeDialog
    beforeEach(() => {
      openEditDialog = jest
        .spyOn(Header.methods, "openEditDialog")
        .mockReturnValue(true)
      openPasswordChangeDialog = jest
        .spyOn(Header.methods, "openPasswordChangeDialog")
        .mockReturnValue(true)
      wrapper = mount(Header, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    describe("マイユーザー管理メニュー", () => {
      beforeEach(async () => {
        // ログインデータを登録
        await wrapper.vm.$store.commit("auth/" + types.AUTH_SET_USER, { id: 1 })

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
  })

  describe("項目表示テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(Header, {
        localVue,
        store,
        router,
        vuetify,
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
      await wrapper.vm.$store.commit("auth/" + types.AUTH_SET_USER, {
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
      await wrapper.vm.$store.commit("auth/" + types.AUTH_SET_USER, {
        name: "テスト",
        email: "test@test.com",
        role: 2
      })

      // 権限を管理者以上にする
      await wrapper.vm.$store.commit("auth/" + types.AUTH_SET_PERMISSION, {
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
      await wrapper.vm.$store.commit("auth/" + types.AUTH_SET_USER, {
        name: "テスト",
        email: "test@test.com",
        role: 1
      })

      // 権限を開発者にする
      await wrapper.vm.$store.commit("auth/" + types.AUTH_SET_PERMISSION, {
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
