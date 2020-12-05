import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import ValidationField from "@/components/form/validationField"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/form/validationField", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(ValidationField, {
        localVue,
        vuetify,
        sync: false
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    describe("バリデーションのオプションを生成", () => {
      let result, exceptData

      test("デフォルト", () => {
        exceptData = {}
        result = wrapper.vm.createValidationOptions
        expect(result).toEqual(exceptData)
      })

      test("props から入力", () => {
        wrapper.setProps({
          rules: { required: true, max: 255 },
          mode: "lazy",
          label: "フィールド",
          name: "field"
        })
        exceptData = {
          rules: { required: true, max: 255 },
          mode: "lazy",
          name: "フィールド",
          vid: "field"
        }
        result = wrapper.vm.createValidationOptions
        expect(result).toEqual(exceptData)
      })

      test("validationOptions から入力", () => {
        wrapper.setProps({
          validationOptions: {
            rules: { required: true, max: 255 },
            mode: "lazy",
            name: "フィールド",
            vid: "field"
          }
        })
        exceptData = {
          rules: { required: true, max: 255 },
          mode: "lazy",
          name: "フィールド",
          vid: "field"
        }
        result = wrapper.vm.createValidationOptions
        expect(result).toEqual(exceptData)
      })
    })

    describe("フォームフィールドのオプションを生成", () => {
      let result, exceptData

      test("デフォルト", () => {
        exceptData = { type: "text" }
        result = wrapper.vm.createFormOptions
        expect(result).toEqual(exceptData)
      })

      test("props から入力", () => {
        wrapper.setProps({
          type: "password",
          label: "フィールド",
          name: "field"
        })
        exceptData = {
          type: "password",
          label: "フィールド",
          name: "field"
        }
        result = wrapper.vm.createFormOptions
        expect(result).toEqual(exceptData)
      })

      test("formOptions から入力", () => {
        wrapper.setProps({
          formOptions: {
            label: "フィールド",
            name: "field"
          }
        })
        exceptData = {
          type: "text",
          label: "フィールド",
          name: "field"
        }
        result = wrapper.vm.createFormOptions
        expect(result).toEqual(exceptData)
      })

      test("rules を validationOptions から入力", () => {
        wrapper.setProps({
          validationOptions: {
            rules: { required: true }
          }
        })
        exceptData = {
          type: "text",
          required: true
        }
        result = wrapper.vm.createFormOptions
        expect(result).toEqual(exceptData)
      })

      test("required ルール", () => {
        wrapper.setProps({
          rules: { required: true }
        })
        exceptData = {
          type: "text",
          required: true
        }
        result = wrapper.vm.createFormOptions
        expect(result).toEqual(exceptData)
      })

      test("min_value ルール", () => {
        wrapper.setProps({
          type: "number",
          rules: { min_value: 8 }
        })
        exceptData = {
          type: "number",
          min: 8
        }
        result = wrapper.vm.createFormOptions
        expect(result).toEqual(exceptData)
      })

      test("max_value ルール", () => {
        wrapper.setProps({
          type: "number",
          rules: { max_value: 255 }
        })
        exceptData = {
          type: "number",
          max: 255
        }
        result = wrapper.vm.createFormOptions
        expect(result).toEqual(exceptData)
      })
    })
  })

  describe("validationField から ValidationProvider へのメソッド実行テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(ValidationField, {
        localVue,
        vuetify,
        sync: false
      })
    })

    describe("validate", () => {
      let method
      beforeEach(() => {
        // spyOn
        method = jest.spyOn(wrapper.vm.$refs.validation, "validate")
      })

      test("valueなし", () => {
        // validationField のメソッドを実行
        wrapper.vm.validate()

        // ValidationProvider のメソッドが実行されているか
        expect(method).toHaveBeenCalled()
      })

      test("valueあり", () => {
        // validationField のメソッドを実行
        wrapper.vm.validate("test")

        // ValidationProvider のメソッドが実行されているか
        expect(method).toHaveBeenCalled()
      })
    })

    test("validateSilent", () => {
      // spyOn
      const method = jest.spyOn(wrapper.vm.$refs.validation, "validateSilent")

      // validationField のメソッドを実行
      wrapper.vm.validateSilent()

      // ValidationProvider のメソッドが実行されているか
      expect(method).toHaveBeenCalled()
    })

    test("applyResult", async () => {
      // spyOn
      const method = jest.spyOn(wrapper.vm.$refs.validation, "applyResult")

      // validationField のメソッドを実行
      wrapper.vm.applyResult(await wrapper.vm.validate())

      // ValidationProvider のメソッドが実行されているか
      expect(method).toHaveBeenCalled()
    })

    test("reset", () => {
      // spyOn
      const method = jest.spyOn(wrapper.vm.$refs.validation, "reset")

      // validationField のメソッドを実行
      wrapper.vm.reset()

      // ValidationProvider のメソッドが実行されているか
      expect(method).toHaveBeenCalled()
    })

    test("setFlags", () => {
      // spyOn
      const method = jest.spyOn(wrapper.vm.$refs.validation, "setFlags")

      // validationField のメソッドを実行
      wrapper.vm.setFlags({})

      // ValidationProvider のメソッドが実行されているか
      expect(method).toHaveBeenCalled()
    })

    test("setErrors", () => {
      // spyOn
      const method = jest.spyOn(wrapper.vm.$refs.validation, "setErrors")

      // validationField のメソッドを実行
      wrapper.vm.setErrors("")

      // ValidationProvider のメソッドが実行されているか
      expect(method).toHaveBeenCalled()
    })

    test("syncValue", () => {
      // spyOn
      const method = jest.spyOn(wrapper.vm.$refs.validation, "syncValue")

      // validationField のメソッドを実行
      wrapper.vm.syncValue({})

      // ValidationProvider のメソッドが実行されているか
      expect(method).toHaveBeenCalled()
    })
  })

  describe("フォームエラー内容取得テスト", () => {
    let mountOption
    beforeEach(() => {
      mountOption = {
        localVue,
        vuetify,
        sync: false,
        propsData: {
          rules: { required: true, max: 10 }
        }
      }
    })

    test("required", async () => {
      mountOption.propsData.value = ""
      const wrapper = mount(ValidationField, mountOption)
      await wrapper.vm.$refs.validation.validate()
      expect(wrapper.vm.getFailedRules().required).toBeTruthy()
    })

    test("max", async () => {
      mountOption.propsData.value = "a".repeat(11)
      const wrapper = mount(ValidationField, mountOption)
      await wrapper.vm.$refs.validation.validate()
      expect(wrapper.vm.getFailedRules().max).toBeTruthy()
    })

    test("valid", async () => {
      mountOption.propsData.value = "test"
      const wrapper = mount(ValidationField, mountOption)
      await wrapper.vm.$refs.validation.validate()
      expect(Object.keys(wrapper.vm.getFailedRules()).length).toBe(0)
    })
  })
})
