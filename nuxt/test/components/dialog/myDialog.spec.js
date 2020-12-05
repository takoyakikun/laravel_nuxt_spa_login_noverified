import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import MyDialog from "@/components/dialog/myDialog"

const localVue = createLocalVue()
localVue.use(Vuex)

const vuetify = new Vuetify()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/dialog/myDialog", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(MyDialog, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    describe("ダイアログの開閉", () => {
      test("nameなし", () => {
        // 初期状態は非表示
        expect(wrapper.vm.dialog).toBeFalsy()

        // ダイアログを開く
        wrapper.setProps({ value: true })
        expect(wrapper.vm.dialog).toBeTruthy()

        // ダイアログを閉じる
        wrapper.vm.close()
        expect(wrapper.emitted().input[0][0]).toBeFalsy()
      })

      test("nameあり", () => {
        // nameをセット
        wrapper.setProps({ name: "test" })

        // 初期状態は非表示
        expect(wrapper.vm.dialog).toBeFalsy()

        // ダイアログを開く
        wrapper.vm.$store.dispatch("dialog/openDialog", "test")
        expect(wrapper.vm.dialog).toBeTruthy()

        // ダイアログを閉じる
        wrapper.vm.close()
        expect(wrapper.vm.dialog).toBeFalsy()
      })
    })

    describe("ダイアログの外をクリック", () => {
      let close
      beforeEach(() => {
        // spyOn
        close = jest.spyOn(wrapper.vm, "close")

        // ダイアログを開く設定
        wrapper.setProps({ value: true })
        expect(wrapper.vm.dialog).toBeTruthy()
      })

      test("ダイアログを閉じない設定", () => {
        // ダイアログの外をクリックしてもダイアログを閉じない設定
        wrapper.setProps({ options: { persistent: true } })

        // ダイアログの外をクリックしてダイアログを閉じる
        wrapper.vm.outside()

        // ダイアログを閉じる処理は実行されない
        expect(close).not.toHaveBeenCalled()
      })

      test("ダイアログを閉じる設定", () => {
        // ダイアログの外をクリックするとダイアログを閉じる設定
        wrapper.setProps({ options: { persistent: false } })

        // ダイアログの外をクリックしてダイアログを閉じる
        wrapper.vm.outside()

        // ダイアログを閉じる処理を実行したか
        expect(close).toHaveBeenCalled()
      })
    })
  })

  describe("ボタン動作テスト", () => {
    let wrapper
    let close
    beforeEach(() => {
      close = jest.spyOn(MyDialog.methods, "close").mockReturnValue(true)
      wrapper = mount(MyDialog, {
        localVue,
        store,
        vuetify,
        sync: false,
        propsData: {
          value: true
        }
      })
    })

    describe("閉じるボタン", () => {
      test("titleCloseButton", () => {
        // ボタンをクリック
        wrapper.find("[data-test='titleCloseButton']").trigger("click")
      })

      test("actionsCloseButton", () => {
        // ボタンをクリック
        wrapper.find("[data-test='actionsCloseButton']").trigger("click")
      })

      afterEach(() => {
        // メソッドが実行されたか
        expect(close).toHaveBeenCalled()
      })
    })
  })
})
