import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "~/test/storeConfig"
import setPlugin from "~/test/setPlugin"
import Snackbar from "~/components/snackbar/snackbar"

const localVue = createLocalVue()
localVue.use(Vuex)

const vuetify = new Vuetify()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  setPlugin(localVue)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/snackbar/snackbar", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(Snackbar, {
        localVue,
        store,
        vuetify
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("snackbarを表示する", () => {
      // snackbarを開く処理
      wrapper.vm.snackbar.openSnackbar({
        text: "テスト",
        options: { color: "success" }
      })

      // snackbarが開いているか
      expect(wrapper.vm.snackbar.value).toBeTruthy()

      // snackbarに指定したテキストが表示されているか
      expect(wrapper.vm.snackbar.text).toBe("テスト")

      // snackbarが指定した色で表示されているか
      expect(wrapper.vm.snackbar.options.color).toBe("success")
    })
  })
})
