import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import axios from 'axios'
import api from '~/test/api'
import setPlugin from '~/test/setPlugin'
import storeConfig from '~/test/storeConfig'
import * as types from '~/store/mutation-types'
import setConfigData from '~/test/setConfigData'
import DeleteDialog from '~/components/users/dialogs/deleteDialog'

const localVue = createLocalVue()
localVue.use(Vuex)

const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit('config/' + types.CONFIG_SET_CONFIG, setConfigData)
  localVue.prototype.$api = api({ $axios: axios, store })
  setPlugin(localVue)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  describe('テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(DeleteDialog, {
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
      wrapper = mount(DeleteDialog, {
        localVue,
        store,
        vuetify
      })
    })

    describe('ユーザー削除', () => {
      const deleteUser = {
        id: 1,
        name: 'テスト',
        email: 'test@test.com',
        role: 3,
        delete_flg: 1
      }

      let axiosDelete
      beforeEach(() => {
        // spyOn
        axiosDelete = jest.spyOn(axios, 'delete')

        // ダイアログを開く
        wrapper.vm.openDialog(deleteUser)
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
        expect(axiosDelete).toHaveBeenCalledWith('/api/users/1')

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
        expect(axiosDelete).toHaveBeenCalledWith('/api/users/1')

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
      submit = jest.spyOn(DeleteDialog.methods, 'submit').mockReturnValue(true)
      wrapper = mount(DeleteDialog, {
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
