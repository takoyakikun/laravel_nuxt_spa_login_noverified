import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils'
import { localVue, router, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import Login from '~/components/login/login'

jest.useFakeTimers()

let store
beforeEach(() => {
  store = setStore(localVue)
  setApi(localVue, axios, store)
  setPlugin(localVue)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  describe('テスト', () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()
      wrapper = shallowMount(Login, {
        localVue,
        store,
        router,
        vuetify,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe('フォーム動作テスト', () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()
      wrapper = mount(Login, {
        localVue,
        store,
        router,
        vuetify,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
    })

    describe('ログイン', () => {
      let loginFormValidation
      let axiosPost
      beforeEach(() => {
        // spyOn
        loginFormValidation = jest.spyOn(wrapper.vm.$refs.loginForm, 'validate')
        axiosPost = jest.spyOn(axios, 'post')
      })

      describe('失敗', () => {
        beforeEach(() => {
          // エラーレスポンス
          const response = {
            status: 422
          }
          // axiosのレスポンスをモックする
          axios.post.mockImplementation(url => {
            return Promise.resolve(response)
          })
        })

        test('フロント側エラー', async () => {
          // ログイン処理
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(loginFormValidation).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.loginForm.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPost).not.toHaveBeenCalled()
        })

        test('API側エラー', async () => {
          // フォームを入力してログイン処理
          wrapper.find("input[name='login_id']").setValue('test@test.com')
          wrapper.find("input[name='password']").setValue('password')
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(loginFormValidation).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith('/api/login', {
            login_id: 'test@test.com',
            password: 'password'
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$snackbar.text).toBe('認証に失敗しました。')
          expect(wrapper.vm.$snackbar.options.color).toBe('error')
        })
      })

      test('成功', async () => {
        // spyOn
        const routerPush = jest.spyOn(wrapper.vm.$router, 'push')

        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.post.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // フォームを入力してログイン処理
        wrapper.find("input[name='login_id']").setValue('test@test.com')
        wrapper.find("input[name='password']").setValue('password')
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをした
        expect(loginFormValidation).toHaveBeenCalled()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()
        expect(axiosPost).toHaveBeenCalledWith('/api/login', {
          login_id: 'test@test.com',
          password: 'password'
        })

        // Topへリダイレクトした
        expect(routerPush).toHaveBeenCalled()
        expect(routerPush).toHaveBeenCalledWith('/')
      })

      test('loading中はログイン処理不可', async () => {
        // loading中の設定
        wrapper.setData({
          loading: true
        })

        // ログイン処理
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをしない
        expect(loginFormValidation).not.toHaveBeenCalled()
      })
    })
  })

  describe('ボタン動作テスト', () => {
    let wrapper
    let submit
    beforeEach(() => {
      submit = jest.spyOn(Login.methods, 'submit').mockReturnValue(true)
      wrapper = mount(Login, {
        localVue,
        store,
        router,
        vuetify,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
    })

    test('ログインボタン', () => {
      // ボタンをクリック
      wrapper.find("[data-test='loginButton']").trigger('click')

      // メソッドが実行されたか
      expect(submit).toHaveBeenCalled()
    })
  })

  describe('リンク動作テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(Login, {
        localVue,
        store,
        router,
        vuetify,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
    })

    test('トップボタンリンク', () => {
      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='topButtonLink']").props().to).toBe('/')
    })

    test('パスワードリセットリンク', () => {
      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='passwordResetLink']").props().to).toBe(
        'passwordReset'
      )
    })
  })
})
