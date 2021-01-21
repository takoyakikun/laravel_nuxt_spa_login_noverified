import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import Guest from "@/middleware/guest"

jest.useFakeTimers()
jest.mock("axios")

let store
let redirect
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  redirect = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  test("ログインしていない", async () => {
    // ミドルウェアを実行
    await Guest({ store: store, redirect: redirect })

    // ログインしていないのでfalse
    expect(store.getters["auth/userExists"]).toBeFalsy()

    // リダイレクトしない
    expect(redirect).not.toHaveBeenCalled()
  })

  test("ログインしている", async () => {
    // ログインユーザーデータをストアに追加
    store.state.auth.user = {
      name: "テスト",
      email: "test@test.com",
      role: 10
    }

    // ミドルウェアを実行
    await Guest({ store: store, redirect: redirect })
    jest.runAllTimers()

    // ログインしているのでtrue
    expect(store.getters["auth/userExists"]).toBeTruthy()

    // Topページへリダイレクト
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith("/")
  })
})
