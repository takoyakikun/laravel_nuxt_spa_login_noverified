import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import axios from "axios"
import Admin from "@/middleware/admin"

let store
let redirect

describe("auth", () => {
  beforeEach(() => {
    store = new Vuex.Store(storeConfig)
    redirect = jest.fn()
  })

  test("ログインしていない", async () => {
    // ミドルウェアを実行
    await Admin({ store: store, redirect: redirect })

    // ログインしていないのでfalse
    expect(store.getters["auth/userExists"]).toBeFalsy()

    // ログインページへリダイレクト
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith("/login")
  })

  describe("ログイン", () => {
    let axiosGet
    beforeEach(() => {
      // spyOn
      axiosGet = jest.spyOn(axios, "get")
    })

    test("管理者権限以外", async () => {
      // 管理者アクセス権限レスポンス
      const responseAdmin = {
        status: 200,
        data: [false]
      }
      // axiosのレスポンスをモックする
      axios.get.mockImplementationOnce(url => {
        return Promise.resolve(responseAdmin)
      })
      store.$axios = axios

      // ログインユーザーデータをストアに追加
      store.state.auth.user = {
        name: "テスト",
        email: "test@test.com",
        role: 3
      }

      // ミドルウェアを実行
      await Admin({ store: store, redirect: redirect })

      // ログインしているのでtrue
      expect(store.getters["auth/userExists"]).toBeTruthy()

      // 管理者アクセス権限のAPI送信をした
      expect(axiosGet).toHaveBeenCalled()
      expect(axiosGet).toHaveBeenCalledWith("/api/permission/admin-higher")

      // 管理者権限以外なのでfalse
      expect(store.getters["auth/permission"]("admin-higher")).toBeFalsy()

      // ログインページへリダイレクト
      expect(redirect).toHaveBeenCalled()
      expect(redirect).toHaveBeenCalledWith("/")
    })

    test("管理者権限", async () => {
      // 管理者アクセス権限レスポンス
      const responseAdmin = {
        status: 200,
        data: [true]
      }
      // axiosのレスポンスをモックする
      axios.get.mockImplementationOnce(url => {
        return Promise.resolve(responseAdmin)
      })
      store.$axios = axios

      // ログインユーザーデータをストアに追加
      store.state.auth.user = {
        name: "テスト",
        email: "test@test.com",
        role: 2
      }

      // ミドルウェアを実行
      await Admin({ store: store, redirect: redirect })

      // ログインしているのでtrue
      expect(store.getters["auth/userExists"]).toBeTruthy()

      // 管理者アクセス権限のAPI送信をした
      expect(axiosGet).toHaveBeenCalled()
      expect(axiosGet).toHaveBeenCalledWith("/api/permission/admin-higher")

      // 管理者権限なのでtrue
      expect(store.getters["auth/permission"]("admin-higher")).toBeTruthy()

      // リダイレクトしない
      expect(redirect).not.toHaveBeenCalled()
    })
  })
})
