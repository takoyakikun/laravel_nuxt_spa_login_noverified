import { shallowMount, mount } from '@vue/test-utils'
import { localVue } from '~/test/setLocalVue'
import axios from 'axios'
import Vuetify from 'vuetify'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import * as types from '~/store/mutation-types'
import setConfigData from '~/test/setConfigData'
import DeleteMultiDialog from '~/components/users/dialogs/deleteMultiDialog'

jest.useFakeTimers()

let store
let vuetify
beforeEach(() => {
  store = setStore(localVue)
  setApi(localVue, axios, store)
  setPlugin(localVue)
  vuetify = new Vuetify()
  store.commit('config/' + types.CONFIG_SET_CONFIG, setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  describe('テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(DeleteMultiDialog, {
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
      const deleteUsers = [
        {
          id: 1,
          name: 'テスト1',
          email: 'test1@test.com',
          role: 3,
          delete_flg: 1
        },
        {
          id: 2,
          name: 'テスト2',
          email: 'test2@test.com',
          role: 3,
          delete_flg: 1
        }
      ]

      wrapper = mount(DeleteMultiDialog, {
        localVue,
        store,
        vuetify,
        propsData: {
          deleteUsers: deleteUsers
        }
      })
    })

    describe('ユーザー削除', () => {
      let axiosDelete
      beforeEach(() => {
        // spyOn
        axiosDelete = jest.spyOn(axios, 'delete')

        // ダイアログを開く
        wrapper.vm.openDialog()
      })

      test('失敗', async () => {
        // エラーレスポンス
        const response = {
          status: 403
        }
        // axiosのレスポンスをモックする
        axios.delete.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // ユーザー削除処理
        await wrapper.vm.submit()

        // API送信をした
        expect(axiosDelete).toHaveBeenCalled()
        expect(axiosDelete).toHaveBeenCalledWith('/api/users/[1,2]')

        // snackbarのエラー表示
        expect(wrapper.vm.$snackbar.text).toBe(
          'ユーザーデータの削除に失敗しました。'
        )
        expect(wrapper.vm.$snackbar.options.color).toBe('error')
      })

      test('成功', async () => {
        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.delete.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // ユーザー削除処理
        await wrapper.vm.submit()

        // API送信をした
        expect(axiosDelete).toHaveBeenCalled()
        expect(axiosDelete).toHaveBeenCalledWith('/api/users/[1,2]')

        // snackbarの完了表示
        expect(wrapper.vm.$snackbar.text).toBe('ユーザーデータを削除しました。')
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
        axios.delete.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // ユーザー削除処理
        await wrapper.vm.submit()

        // API送信をしない
        expect(axiosDelete).not.toHaveBeenCalled()
      })
    })
  })

  describe('ボタン動作テスト', () => {
    let wrapper
    let submit
    beforeEach(() => {
      submit = jest
        .spyOn(DeleteMultiDialog.methods, 'submit')
        .mockReturnValue(true)
      wrapper = mount(DeleteMultiDialog, {
        localVue,
        store,
        vuetify
      })
    })

    test('削除ボタン', async () => {
      // ダイアログを開く
      await wrapper.vm.$refs.dialog.openDialog()

      // ボタンをクリック
      wrapper.find("[data-test='submitButton']").trigger('click')

      // メソッドが実行されたか
      expect(submit).toHaveBeenCalled()
    })
  })
})
