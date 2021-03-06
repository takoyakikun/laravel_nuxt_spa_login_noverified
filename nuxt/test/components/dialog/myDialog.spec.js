import { shallowMount, mount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import MyDialog from '~/components/dialog/myDialog'

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
      wrapper = shallowMount(MyDialog, mountOptions)
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe('ダイアログの開閉', () => {
    test('nameなし', () => {
      wrapper = shallowMount(MyDialog, mountOptions)

      // 初期状態は非表示
      expect(wrapper.vm.state.value).toBeFalsy()

      // nameが dialog-○ の形式になっている
      const name = 'dialog-' + Object.keys(wrapper.vm.$dialog.state).length
      expect(wrapper.vm.state.name).toEqual(name)

      // ダイアログを開く
      wrapper.vm.openDialog()
      expect(wrapper.vm.state.value).toBeTruthy()

      // nameを指定してダイアログを開く
      wrapper.vm.$dialog.openDialog(name)
      expect(wrapper.vm.state.value).toBeTruthy()

      // ダイアログを閉じる
      wrapper.vm.closeDialog()
      expect(wrapper.vm.state.value).toBeFalsy()
    })

    test('nameあり', () => {
      // nameをセット
      const name = 'test'
      mountOptions.propsData = { name: name }

      wrapper = shallowMount(MyDialog, mountOptions)

      // 初期状態は非表示
      expect(wrapper.vm.state.value).toBeFalsy()

      // ダイアログを開く
      wrapper.vm.openDialog()
      expect(wrapper.vm.state.value).toBeTruthy()

      // nameがセットされた名前になっている
      expect(wrapper.vm.state.name).toEqual(name)

      // ダイアログを開く
      wrapper.vm.$dialog.openDialog(name)
      expect(wrapper.vm.state.value).toBeTruthy()

      // ダイアログを閉じる
      wrapper.vm.closeDialog()
      expect(wrapper.vm.state.value).toBeFalsy()
    })

    describe('ダイアログの外をクリック', () => {
      test('ダイアログを閉じない設定', () => {
        // ダイアログの外をクリックしてもダイアログを閉じない設定
        mountOptions.propsData = {
          options: { persistent: true }
        }

        wrapper = shallowMount(MyDialog, mountOptions)

        // ダイアログを開いた状態にする
        wrapper.vm.openDialog()
        expect(wrapper.vm.state.value).toBeTruthy()

        // ダイアログの外をクリック
        wrapper.vm.outside()

        // ダイアログが閉じない
        expect(wrapper.vm.state.value).toBeTruthy()
      })

      test('ダイアログを閉じる設定', () => {
        wrapper = shallowMount(MyDialog, mountOptions)

        // ダイアログを開いた状態にする
        wrapper.vm.openDialog()
        expect(wrapper.vm.state.value).toBeTruthy()

        // ダイアログの外をクリック
        wrapper.vm.outside()

        // ダイアログが閉じる
        expect(wrapper.vm.state.value).toBeFalsy()
      })
    })
  })

  describe('ボタン動作テスト', () => {
    describe('閉じるボタン', () => {
      let closeDialog
      beforeEach(() => {
        // nameをセット
        mountOptions.propsData = { name: 'test' }

        wrapper = mount(MyDialog, mountOptions)

        // ダイアログを開いた状態にする
        wrapper.vm.openDialog()

        // spyOn
        closeDialog = jest.spyOn(wrapper.vm, 'closeDialog')
      })

      test('titleCloseButton', () => {
        // ボタンをクリック
        wrapper.find("[data-test='titleCloseButton']").trigger('click')
      })

      test('actionsCloseButton', () => {
        // ボタンをクリック
        wrapper.find("[data-test='actionsCloseButton']").trigger('click')
      })

      afterEach(() => {
        // メソッドが実行されたか
        expect(closeDialog).toHaveBeenCalled()
      })
    })
  })
})
