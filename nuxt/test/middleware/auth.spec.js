import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import axios from "axios"
import Api from "@/test/api"
import Auth from "@/middleware/auth"

jest.useFakeTimers()
jest.mock("axios")

let store
let redirect
let ApiClass
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  redirect = jest.fn()
  ApiClass = new Api({ axios, store })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("middleware/auth", () => {
  beforeEach(() => {})

  test("ログインしていない", async () => {
    // ミドルウェアを実行
    await Auth({ store: store, redirect: redirect, $api: ApiClass })
    jest.runAllTimers()

    // ログインしていないのでfalse
    expect(store.getters["auth/userExists"]).toBeFalsy()

    // ログインページへリダイレクト
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith("/login")
  })

  test("ログインしている", async () => {
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
      role: 3
    }

    // ミドルウェアを実行
    await Auth({ store: store, redirect: redirect })

    // ログインしているのでtrue
    expect(store.getters["auth/userExists"]).toBeTruthy()

    // リダイレクトしない
    expect(redirect).not.toHaveBeenCalled()
  })
})
