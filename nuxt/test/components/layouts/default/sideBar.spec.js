import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import VueRouter from "vue-router"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import SideBar from "@/components/layouts/default/sideBar"

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const vuetify = new Vuetify()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/setConfig", setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/layouts/default/sideBar", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(SideBar, {
        localVue,
        store,
        vuetify,
        sync: false,
        propsData: {
          value: false
        }
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe("リンク動作テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SideBar, {
        localVue,
        store,
        router,
        vuetify,
        sync: false,
        propsData: {
          value: false
        }
      })
    })

    test("トップページリンク", () => {
      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='topItemLink']").props().to).toBe("/")
    })

    test("認証済ページリンク", async () => {
      // ログインデータを追加
      await wrapper.vm.$store.commit("auth/setUser", {
        name: "テスト",
        email: "test@test.com",
        role: 10
      })

      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='authItemLink']").props().to).toBe("auth")
    })

    test("ユーザー管理ページリンク", async () => {
      // 権限を管理者以上にする
      await wrapper.vm.$store.commit("auth/setPermission", {
        category: "admin-higher",
        permission: true
      })

      // ログインデータを追加
      await wrapper.vm.$store.commit("auth/setUser", {
        name: "テスト",
        email: "test@test.com",
        role: 5
      })

      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='usersItemLink']").props().to).toBe(
        "users"
      )
    })
  })

  describe("項目表示テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SideBar, {
        localVue,
        store,
        router,
        vuetify,
        sync: false,
        propsData: {
          value: false
        }
      })
    })

    test("ログアウト", () => {
      // トップページリンク項目
      expect(wrapper.find("[data-test='topItemLink']").exists()).toBeTruthy()

      // 認証済ページリンク項目
      expect(wrapper.find("[data-test='authItemLink']").exists()).toBeFalsy()

      // ユーザー管理リンク項目
      expect(wrapper.find("[data-test='usersItemLink']").exists()).toBeFalsy()
    })

    test("一般権限", async () => {
      // ログインデータを追加
      await wrapper.vm.$store.commit("auth/setUser", {
        name: "テスト",
        email: "test@test.com",
        role: 3
      })

      // トップページリンク項目
      expect(wrapper.find("[data-test='topItemLink']").exists()).toBeTruthy()

      // 認証済ページリンク項目
      expect(wrapper.find("[data-test='authItemLink']").exists()).toBeTruthy()

      // ユーザー管理リンク項目
      expect(wrapper.find("[data-test='usersItemLink']").exists()).toBeFalsy()
    })

    test("管理者権限", async () => {
      // 権限を管理者以上にする
      await wrapper.vm.$store.commit("auth/setPermission", {
        category: "admin-higher",
        permission: true
      })

      // ログインデータを追加
      await wrapper.vm.$store.commit("auth/setUser", {
        name: "テスト",
        email: "test@test.com",
        role: 2
      })

      // トップページリンク項目
      expect(wrapper.find("[data-test='topItemLink']").exists()).toBeTruthy()

      // 認証済ページリンク項目
      expect(wrapper.find("[data-test='authItemLink']").exists()).toBeTruthy()

      // ユーザー管理リンク項目
      expect(wrapper.find("[data-test='usersItemLink']").exists()).toBeTruthy()
    })

    test("開発者権限", async () => {
      // 権限を開発者にする
      await wrapper.vm.$store.commit("auth/setPermission", {
        category: "system-only",
        permission: true
      })

      // 権限を管理者以上にする
      await wrapper.vm.$store.commit("auth/setPermission", {
        category: "admin-higher",
        permission: true
      })

      // ログインデータを追加
      await wrapper.vm.$store.commit("auth/setUser", {
        name: "テスト",
        email: "test@test.com",
        role: 1
      })

      // トップページリンク項目
      expect(wrapper.find("[data-test='topItemLink']").exists()).toBeTruthy()

      // 認証済ページリンク項目
      expect(wrapper.find("[data-test='authItemLink']").exists()).toBeTruthy()

      // ユーザー管理リンク項目
      expect(wrapper.find("[data-test='usersItemLink']").exists()).toBeTruthy()
    })
  })
})
