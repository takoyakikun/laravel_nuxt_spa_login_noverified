import { shallowMount, mount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import LoginForm from '@/components/login/loginForm'
import Form from '@/components/form/form'
import { ValidationObserver } from 'vee-validate'

jest.useFakeTimers()

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
  describe('テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(LoginForm, {
        localVue,
        store,
        vuetify,
        stubs: {
          Form
        }
      })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe('フォームバリデーションテスト', () => {
    let wrapper
    let formWrapper
    beforeEach(() => {
      wrapper = mount(ValidationObserver, {
        localVue,
        store,
        vuetify,
        slots: {
          default: LoginForm
        }
      })
      formWrapper = wrapper.findComponent(LoginForm)
    })

    describe('Login', () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='login_id']")
        validation = formWrapper.vm.$refs.loginIdValidation
      })

      test('requiredエラー', async () => {
        // 入力データをセット
        form.setValue('')

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.required).toBeTruthy()
      })

      test('maxエラー', async () => {
        // 入力データをセット
        form.setValue('a'.repeat(256))

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.max).toBeTruthy()
      })

      test('emailエラー', async () => {
        // 入力データをセット
        form.setValue('aaa')

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.email).toBeTruthy()
      })

      test('成功', async () => {
        // 入力データをセット
        form.setValue('test@test.com')

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(Object.keys(validation.failedRules).length).toBe(0)
      })
    })

    describe('Password', () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='password']")
        validation = formWrapper.vm.$refs.passwordValidation
      })

      test('requiredエラー', async () => {
        // 入力データをセット
        form.setValue('')

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.required).toBeTruthy()
      })

      test('成功', async () => {
        // 入力データをセット
        form.setValue('password')

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(Object.keys(validation.failedRules).length).toBe(0)
      })
    })
  })
})
