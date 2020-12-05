import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import axios from "axios"
import Verified from "@/middleware/verified"

let store
let redirect

describe("auth", () => {
  beforeEach(() => {
    store = new Vuex.Store(storeConfig)
    redirect = jest.fn()
  })

  test("ログインしていない", async () => {
    // ミドルウェアを実行
    await Verified({ store: store, redirect: redirect })

    // ログインしていないのでfalse
    expect(store.getters["auth/userExists"]).toBeFalsy()

    // リダイレクトしない
    expect(redirect).not.toHaveBeenCalled()
  })

  test("ログインしているがメール認証をしていない", async () => {
    // spyOn
    const axiosGet = jest.spyOn(axios, "get")

    // メール認証アクセス権限レスポンス
    const response = {
      status: 200,
      data: [false]
    }
    // axiosのレスポンスをモックする
    axios.get.mockImplementation(url => {
      return Promise.resolve(response)
    })
    store.$axios = axios

    // ログインユーザーデータをストアに追加
    store.state.auth.user = {
      name: "テスト",
      email: "test@test.com",
      role: 10
    }

    // ミドルウェアを実行
    await Verified({ store: store, redirect: redirect })

    // ログインしているのでtrue
    expect(store.getters["auth/userExists"]).toBeTruthy()

    // メール認証アクセス権限のAPI送信をした
    expect(axiosGet).toHaveBeenCalled()
    expect(axiosGet).toHaveBeenCalledWith("/api/permission/verified")

    // メール認証していないのでfalse
    expect(store.getters["auth/permission"]("verified")).toBeFalsy()

    // 認証メール再送信ページへリダイレクト
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith("/resend")
  })

  test("ログインしていてメール認証もしている", async () => {
    // spyOn
    const axiosGet = jest.spyOn(axios, "get")

    // メール認証アクセス権限レスポンス
    const response = {
      status: 200,
      data: [true]
    }
    // axiosのレスポンスをモックする
    axios.get.mockImplementation(url => {
      return Promise.resolve(response)
    })
    store.$axios = axios

    // ログインユーザーデータをストアに追加
    store.state.auth.user = {
      name: "テスト",
      email: "test@test.com",
      role: 10
    }

    // ミドルウェアを実行
    await Verified({ store: store, redirect: redirect })

    // ログインしているのでtrue
    expect(store.getters["auth/userExists"]).toBeTruthy()

    // メール認証アクセス権限のAPI送信をした
    expect(axiosGet).toHaveBeenCalled()
    expect(axiosGet).toHaveBeenCalledWith("/api/permission/verified")

    // メール認証しているのでtrue
    expect(store.getters["auth/permission"]("verified")).toBeTruthy()

    // リダイレクトしない
    expect(redirect).not.toHaveBeenCalled()
  })
})
