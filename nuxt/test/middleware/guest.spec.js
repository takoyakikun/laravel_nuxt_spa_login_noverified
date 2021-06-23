import axios from 'axios'
import makeMiddlewareOptions from '~/test/makeMiddlewareOptions'
import Guest from '@/middleware/guest'

jest.useFakeTimers()
jest.mock('axios')

let store
let redirect
let middlewareOptions
beforeEach(() => {
  middlewareOptions = makeMiddlewareOptions(axios)
  store = middlewareOptions.store
  redirect = middlewareOptions.redirect
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  test('ログインしていない', async () => {
    // ミドルウェアを実行
    await Guest(middlewareOptions)

    // ログインしていないのでfalse
    expect(store.getters['auth/userExists']).toBeFalsy()

    // リダイレクトしない
    expect(redirect).not.toHaveBeenCalled()
  })

  test('ログインしている', async () => {
    // ログインユーザーデータをストアに追加
    store.state.auth.user = {
      name: 'テスト',
      email: 'test@test.com',
      role: 10
    }

    // ミドルウェアを実行
    await Guest(middlewareOptions)
    jest.runAllTimers()

    // ログインしているのでtrue
    expect(store.getters['auth/userExists']).toBeTruthy()

    // Topページへリダイレクト
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/')
  })
})
