import { shallowMount, mount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import * as types from '~/store/mutation-types'
import setConfigData from '~/test/setConfigData'
import UniqueValidation from '~/composables/form/uniqueValidation'
import EditDialog from '~/components/layouts/default/dialogs/editDialog'

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
      wrapper = shallowMount(EditDialog, {
        localVue,
        store,
        vuetify
      })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe('フォーム動作テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(EditDialog, {
        localVue,
        store,
        vuetify
      })
    })

    describe('ユーザー編集', () => {
      let validate
      let axiosPatch
      beforeEach(async () => {
        // ログインデータを登録
        await wrapper.vm.$store.commit('auth/' + types.AUTH_SET_USER, { id: 1 })

        // ダイアログを開く
        wrapper.vm.openDialog()

        // spyOn
        validate = jest.spyOn(wrapper.vm.$refs.validate, 'validate')
        axiosPatch = jest.spyOn(axios, 'patch')
      })

      describe('失敗', () => {
        beforeEach(() => {
          // エラーレスポンス
          const response = {
            status: 422
          }
          // axiosのレスポンスをモックする
          axios.patch.mockImplementation(url => {
            return Promise.resolve(response)
          })
        })
        test('フロント側エラー', async () => {
          // フォームを空にしてユーザー編集処理
          wrapper.find("input[name='name']").setValue('')
          wrapper.find("input[name='login_id']").setValue('')
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(validate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.validate.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPatch).not.toHaveBeenCalled()
        })

        test('API側エラー', async () => {
          // フォームを入力してユーザー編集処理
          wrapper.find("input[name='name']").setValue('テスト')
          wrapper.find("input[name='login_id']").setValue('test@test.com')
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(validate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPatch).toHaveBeenCalled()
          expect(axiosPatch).toHaveBeenCalledWith('/api/myuser/update', {
            id: 1,
            name: 'テスト',
            login_id: 'test@test.com'
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$snackbar.text).toBe(
            'ユーザーデータの更新に失敗しました。'
          )
          expect(wrapper.vm.$snackbar.options.color).toBe('error')
        })
      })

      test('成功', async () => {
        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.patch.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // フォームを入力してユーザー編集処理
        wrapper.find("input[name='name']").setValue('テスト')
        wrapper.find("input[name='login_id']").setValue('test@test.com')
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをした
        expect(validate).toHaveBeenCalled()

        // API送信をした
        expect(axiosPatch).toHaveBeenCalled()
        expect(axiosPatch).toHaveBeenCalledWith('/api/myuser/update', {
          id: 1,
          name: 'テスト',
          login_id: 'test@test.com'
        })

        // snackbarの完了表示
        expect(wrapper.vm.$snackbar.text).toBe('ユーザーデータを更新しました。')
        expect(wrapper.vm.$snackbar.options.color).toBe('success')
      })

      test('loading中は処理不可', async () => {
        // loading中の設定
        wrapper.setData({
          loading: true
        })
        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.patch.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // フォームを入力してユーザー編集処理
        wrapper.find("input[name='name']").setValue('テスト')
        wrapper.find("input[name='login_id']").setValue('test@test.com')
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // API送信をしない
        expect(axiosPatch).not.toHaveBeenCalled()
      })
    })
  })

  describe('ボタン動作テスト', () => {
    let wrapper
    let submit
    beforeEach(() => {
      submit = jest.spyOn(EditDialog.methods, 'submit').mockReturnValue(true)
      wrapper = mount(EditDialog, {
        localVue,
        store,
        vuetify
      })
    })

    test('更新ボタン', async () => {
      // ダイアログを開く
      await wrapper.vm.$refs.dialog.openDialog()

      // ボタンをクリック
      wrapper.find("[data-test='submitButton']").trigger('click')

      // メソッドが実行されたか
      expect(submit).toHaveBeenCalled()
    })
  })
})
