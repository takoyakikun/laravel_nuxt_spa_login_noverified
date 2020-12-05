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

  test("管理者権限以外でログインしているがメール認証をしていない", async () => {
    // spyOn
    const axiosGet = jest.spyOn(axios, "get")

    // 管理者アクセス権限レスポンス
    const responseAdmin = {
      status: 200,
      data: [false]
    }
    // メール認証アクセス権限レスポンス
    const responseVerified = {
      status: 200,
      data: [false]
    }
    // axiosのレスポンスをモックする
    axios.get
      .mockImplementationOnce(url => {
        return Promise.resolve(responseAdmin)
      })
      .mockImplementationOnce(url => {
        return Promise.resolve(responseVerified)
      })
    store.$axios = axios

    // ログインユーザーデータをストアに追加
    store.state.auth.user = {
      name: "テスト",
      email: "test@test.com",
      role: 10
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

    // メール認証アクセス権限のAPI送信をした
    expect(axiosGet).toHaveBeenCalled()
    expect(axiosGet).toHaveBeenCalledWith("/api/permission/verified")

    // メール認証していないのでfalse
    expect(store.getters["auth/permission"]("verified")).toBeFalsy()

    // ログインページへリダイレクト
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith("/")
  })

  test("管理者権限以外でログインしていてメール認証もしている", async () => {
    // spyOn
    const axiosGet = jest.spyOn(axios, "get")

    // 管理者アクセス権限レスポンス
    const responseAdmin = {
      status: 200,
      data: [false]
    }
    // メール認証アクセス権限レスポンス
    const responseVerified = {
      status: 200,
      data: [true]
    }
    // axiosのレスポンスをモックする
    axios.get
      .mockImplementationOnce(url => {
        return Promise.resolve(responseAdmin)
      })
      .mockImplementationOnce(url => {
        return Promise.resolve(responseVerified)
      })
    store.$axios = axios

    // ログインユーザーデータをストアに追加
    store.state.auth.user = {
      name: "テスト",
      email: "test@test.com",
      role: 5
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

    // メール認証アクセス権限のAPI送信をした
    expect(axiosGet).toHaveBeenCalled()
    expect(axiosGet).toHaveBeenCalledWith("/api/permission/verified")

    // メール認証しているのでtrue
    expect(store.getters["auth/permission"]("verified")).toBeTruthy()

    // ログインページへリダイレクト
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith("/")
  })

  test("管理者権限でログインしているがメール認証をしていない", async () => {
    // spyOn
    const axiosGet = jest.spyOn(axios, "get")

    // 管理者アクセス権限レスポンス
    const responseAdmin = {
      status: 200,
      data: [true]
    }
    // メール認証アクセス権限レスポンス
    const responseVerified = {
      status: 200,
      data: [false]
    }
    // axiosのレスポンスをモックする
    axios.get
      .mockImplementationOnce(url => {
        return Promise.resolve(responseAdmin)
      })
      .mockImplementationOnce(url => {
        return Promise.resolve(responseVerified)
      })
    store.$axios = axios

    // ログインユーザーデータをストアに追加
    store.state.auth.user = {
      name: "テスト",
      email: "test@test.com",
      role: 5
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

    // メール認証アクセス権限のAPI送信をした
    expect(axiosGet).toHaveBeenCalled()
    expect(axiosGet).toHaveBeenCalledWith("/api/permission/verified")

    // メール認証していないのでfalse
    expect(store.getters["auth/permission"]("verified")).toBeFalsy()

    // 認証メール再送信ページへリダイレクト
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith("/resend")
  })

  test("管理者権限でログインしていてメール認証もしている", async () => {
    // spyOn
    const axiosGet = jest.spyOn(axios, "get")

    // 管理者アクセス権限レスポンス
    const responseAdmin = {
      status: 200,
      data: [true]
    }
    // メール認証アクセス権限レスポンス
    const responseVerified = {
      status: 200,
      data: [true]
    }
    // axiosのレスポンスをモックする
    axios.get
      .mockImplementationOnce(url => {
        return Promise.resolve(responseAdmin)
      })
      .mockImplementationOnce(url => {
        return Promise.resolve(responseVerified)
      })
    store.$axios = axios

    // ログインユーザーデータをストアに追加
    store.state.auth.user = {
      name: "テスト",
      email: "test@test.com",
      role: 5
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

    // メール認証アクセス権限のAPI送信をした
    expect(axiosGet).toHaveBeenCalled()
    expect(axiosGet).toHaveBeenCalledWith("/api/permission/verified")

    // メール認証しているのでtrue
    expect(store.getters["auth/permission"]("verified")).toBeTruthy()

    // リダイレクトしない
    expect(redirect).not.toHaveBeenCalled()
  })
})
