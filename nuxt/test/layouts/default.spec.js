import { shallowMount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import Default from '~/layouts/default'

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
      vuetify,
      stubs: {
        nuxt: true
      }
    }
  })

  describe('', () => {
    beforeEach(() => {
      wrapper = shallowMount(Default, mountOptions)
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    describe('サイドバー', () => {
      test('開く', () => {
        // 初期値はfalse
        expect(wrapper.vm.drawer).toBeFalsy()

        // サイドバーを開く
        wrapper.vm.setDrawer(true)

        // 開いたのでtrue
        expect(wrapper.vm.drawer).toBeTruthy()
      })

      test('閉じる', () => {
        // 初期値をtrueにする
        wrapper.setData({
          drawer: true
        })
        expect(wrapper.vm.drawer).toBeTruthy()

        // サイドバーを閉じる
        wrapper.vm.setDrawer(false)

        // 閉じたのでfalse
        expect(wrapper.vm.drawer).toBeFalsy()
      })
    })
  })
})
