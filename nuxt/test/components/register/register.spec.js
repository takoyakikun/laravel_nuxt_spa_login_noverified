import { shallowMount, mount } from '@vue/test-utils'
import { localVue, router, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import * as types from '~/store/mutation-types'
import setConfigData from '~/test/setConfigData'
import UniqueValidation from '~/composables/form/uniqueValidation'
import Register from '~/components/register/register'

jest.useFakeTimers()
jest.mock('axios')

// ユニークのバリデーションをモック
jest.mock('~/composables/form/uniqueValidation')
UniqueValidation.mockImplementation(() => {
  return { userUnique: value => 1 }
})

let store
beforeEach(() => {
  store = setStore(localVue)
  setApi(localVue, axios, store)
  setPlugin(localVue)
  store.commit('config/' + types.CONFIG_SET_CONFIG, setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  describe('テスト', () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()

      wrapper = shallowMount(Register, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe('フォーム送信テスト', () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()

      wrapper = mount(Register, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    describe('ユーザー追加', () => {
      let registerFormValidation
      let axiosPost
      beforeEach(() => {
        // spyOn
        registerFormValidation = jest.spyOn(
          wrapper.vm.$refs.registerForm,
          'validate'
        )
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
          // ユーザー追加処理
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(registerFormValidation).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.registerForm.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPost).not.toHaveBeenCalled()
        })

        test('API側エラー', async () => {
          // フォームを入力してユーザー追加処理
          wrapper.find("input[name='name']").setValue('テスト')
          wrapper.find("input[name='login_id']").setValue('test@test.com')
          wrapper.find("input[name='password']").setValue('password')
          wrapper
            .find("input[name='password_confirmation']")
            .setValue('password')
          await wrapper.vm.submit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(registerFormValidation).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith('/api/register', {
            name: 'テスト',
            login_id: 'test@test.com',
            password: 'password',
            password_confirmation: 'password'
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$snackbar.text).toBe(
            '新規ユーザーの作成に失敗しました。'
          )
          expect(wrapper.vm.$snackbar.options.color).toBe('error')
        })
      })

      describe('成功', () => {
        let routerPush
        beforeEach(() => {
          // spyOn
          routerPush = jest.spyOn(wrapper.vm.$router, 'push')
        })

        test('認証失敗', async () => {
          // 正常なレスポンス
          const response = {
            status: 200
          }
          // エラーレスポンス
          const responseError = {
            status: 422
          }
          // axiosのレスポンスをモックする
          axios.post
            .mockImplementationOnce(url => {
              return Promise.resolve(response)
            })
            .mockImplementationOnce(url => {
              return Promise.resolve(responseError)
            })

          // フォームを入力してログイン処理
          wrapper.find("input[name='name']").setValue('テスト')
          wrapper.find("input[name='login_id']").setValue('test@test.com')
          wrapper.find("input[name='password']").setValue('password')
          wrapper
            .find("input[name='password_confirmation']")
            .setValue('password')
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(registerFormValidation).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith('/api/register', {
            name: 'テスト',
            login_id: 'test@test.com',
            password: 'password',
            password_confirmation: 'password'
          })
          expect(axiosPost).toHaveBeenCalledWith('/api/login', {
            login_id: 'test@test.com',
            password: 'password'
          })

          // ログインページへリダイレクトした
          expect(routerPush).toHaveBeenCalled()
          expect(routerPush).toHaveBeenCalledWith('/login')

          // snackbarのエラー表示
          expect(wrapper.vm.$snackbar.text).toBe('認証に失敗しました。')
          expect(wrapper.vm.$snackbar.options.color).toBe('error')
        })

        test('認証成功', async () => {
          // 正常なレスポンス
          const response = {
            status: 200
          }
          // axiosのレスポンスをモックする
          axios.post.mockImplementation(url => {
            return Promise.resolve(response)
          })

          // フォームを入力してログイン処理
          wrapper.find("input[name='name']").setValue('テスト')
          wrapper.find("input[name='login_id']").setValue('test@test.com')
          wrapper.find("input[name='password']").setValue('password')
          wrapper
            .find("input[name='password_confirmation']")
            .setValue('password')
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(registerFormValidation).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith('/api/register', {
            name: 'テスト',
            login_id: 'test@test.com',
            password: 'password',
            password_confirmation: 'password'
          })
          expect(axiosPost).toHaveBeenCalledWith('/api/login', {
            login_id: 'test@test.com',
            password: 'password'
          })

          // メール認証ページへリダイレクトした
          expect(routerPush).toHaveBeenCalled()
          expect(routerPush).toHaveBeenCalledWith('/resend')

          // snackbarの完了表示
          expect(wrapper.vm.$snackbar.text).toBe('新規ユーザーを作成しました。')
          expect(wrapper.vm.$snackbar.options.color).toBe('success')
        })
      })

      test('loading中はログイン処理不可', async () => {
        // spyOn
        const registerFormValidation = jest.spyOn(
          wrapper.vm.$refs.registerForm,
          'validate'
        )

        // loading中の設定
        wrapper.setData({
          loading: true
        })

        // ログイン処理
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをしない
        expect(registerFormValidation).not.toHaveBeenCalled()
      })
    })
  })

  describe('ボタン動作テスト', () => {
    let wrapper
    let submit
    beforeEach(() => {
      submit = jest.spyOn(Register.methods, 'submit').mockReturnValue(true)
      wrapper = mount(Register, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test('パスワードリセットボタン', () => {
      // ボタンをクリック
      wrapper.find("[data-test='submitButton']").trigger('click')

      // メソッドが実行されたか
      expect(submit).toHaveBeenCalled()
    })
  })

  describe('リンク動作テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(Register, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test('トップボタンリンク', () => {
      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='topButtonLink']").props().to).toBe('/')
    })
  })
})
