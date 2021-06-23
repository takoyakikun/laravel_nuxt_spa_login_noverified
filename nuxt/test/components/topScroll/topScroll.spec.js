import { shallowMount, mount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import TopScroll from '~/components/topScroll/topScroll'

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
      wrapper = shallowMount(TopScroll, mountOptions)
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test('トップスクロールボタンの表示/非表示', () => {
      // 縦の位置が100px以下は表示しない
      window.scrollY = 100
      wrapper.vm.handleScroll()
      expect(wrapper.vm.showTopScroll).toBeFalsy()

      // 縦の位置が101px以上に変わると表示に切り替わる
      window.scrollY = 101
      wrapper.vm.handleScroll()
      expect(wrapper.vm.showTopScroll).toBeTruthy()

      // 縦の位置が100px以下に変わると非表示に切り替わる
      window.scrollY = 100
      wrapper.vm.handleScroll()
      expect(wrapper.vm.showTopScroll).toBeFalsy()
    })

    test('destroy時のremoveEventListener動作', () => {
      const removeEventListener = jest.spyOn(window, 'removeEventListener')

      // destroyする
      wrapper.destroy()

      // window.removeEventListener が実行されたか
      expect(removeEventListener).toHaveBeenCalled()
    })
  })

  describe('ボタン動作テスト', () => {
    let topScroll
    beforeEach(() => {
      topScroll = jest.spyOn(TopScroll.methods, 'topScroll')
      wrapper = mount(TopScroll, mountOptions)
    })

    test('トップスクロールボタンを押してトップへスクロールする', () => {
      // トップスクロールボタンをクリック
      wrapper.find("[data-test='topScrollButton']").trigger('click')

      // topScroll メソッドが実行されたか
      expect(topScroll).toHaveBeenCalled()
    })
  })
})
