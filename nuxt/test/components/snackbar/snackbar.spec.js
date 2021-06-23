import { shallowMount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import Snackbar from '~/components/snackbar/snackbar'

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
  let wrapper
  let mountOptions
  beforeEach(() => {
    mountOptions = {
      localVue,
      store,
      vuetify
    }
  })

  describe('', () => {
    beforeEach(() => {
      wrapper = shallowMount(Snackbar, mountOptions)
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test('snackbarを表示する', () => {
      // snackbarを開く処理
      wrapper.vm.snackbar.openSnackbar({
        text: 'テスト',
        options: { color: 'success' }
      })

      // snackbarが開いているか
      expect(wrapper.vm.snackbar.value).toBeTruthy()

      // snackbarに指定したテキストが表示されているか
      expect(wrapper.vm.snackbar.text).toBe('テスト')

      // snackbarが指定した色で表示されているか
      expect(wrapper.vm.snackbar.options.color).toBe('success')
    })
  })
})
