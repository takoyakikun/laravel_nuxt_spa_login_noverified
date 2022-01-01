import { shallowMount, mount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import * as types from '~/store/mutation-types'
import setConfigData from '~/test/setConfigData'
import UniqueValidation from '~/composables/form/uniqueValidation'
import UserForm from '~/components/users/forms/userForm'
import Form from '~/components/form/form'
import { ValidationObserver } from 'vee-validate'

jest.useFakeTimers()
jest.mock('axios')

// ユニークのバリデーションをモック
jest.mock('~/composables/form/uniqueValidation')
UniqueValidation.mockImplementation(() => {
  return { userUnique: value => 1 }
})

let store
beforeEach(() => {
  store = setStore(localVue)
  setApi(localVue, axios, store)
  setPlugin(localVue)
  store.commit('config/' + types.CONFIG_SET_CONFIG, setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  let mountOptions
  beforeEach(() => {
    mountOptions = {
      localVue,
      store,
      vuetify,
      stubs: {
        Form
      }
    }
  })

  test('is a Vue instance', () => {
    const wrapper = shallowMount(UserForm, mountOptions)

    expect(wrapper.vm).toBeTruthy()
  })

  describe('項目表示テスト', () => {
    beforeEach(() => {
      mountOptions = {
        localVue,
        store,
        vuetify,
        propsData: {
          drawer: false
        }
      }
    })

    test('自ユーザー', () => {
      // 自ユーザー設定
      mountOptions.propsData = { myuser: true }

      const wrapper = mount(UserForm, mountOptions)

      // アクセス権限フォーム項目
      expect(wrapper.find("[data-test='roleForm']").exists()).toBeFalsy()
    })

    test('自ユーザー以外', () => {
      // 自ユーザー以外を設定
      mountOptions.propsData = { myuser: false }

      const wrapper = mount(UserForm, mountOptions)

      // アクセス権限フォーム項目
      expect(wrapper.find("[data-test='roleForm']").exists()).toBeTruthy()
    })

    test('フォームタイプ無し', () => {
      // フォームタイプを設定しない
      mountOptions.propsData = { formType: '' }

      const wrapper = mount(UserForm, mountOptions)

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeFalsy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeFalsy()
    })

    test('createフォームタイプ', () => {
      // createフォームタイプ設定
      mountOptions.propsData = { formType: 'create' }

      const wrapper = mount(UserForm, mountOptions)

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeTruthy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeTruthy()
    })

    test('usersCreateフォームタイプ', () => {
      // usersCreateフォームタイプ設定
      mountOptions.propsData = { formType: 'usersCreate' }

      const wrapper = mount(UserForm, mountOptions)

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeFalsy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeFalsy()
    })

    test('editフォームタイプ', async () => {
      // createフォームタイプ設定
      mountOptions.propsData = { formType: 'edit' }

      const wrapper = mount(UserForm, mountOptions)

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeFalsy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeFalsy()
    })
  })

  describe('フォームバリデーションテスト', () => {
    let wrapper
    let mountOptions
    let formWrapper
    beforeEach(() => {
      mountOptions = {
        localVue,
        store,
        vuetify,
        slots: {
          default: UserForm
        }
      }
      wrapper = mount(ValidationObserver, mountOptions)

      formWrapper = wrapper.findComponent(UserForm)
    })

    describe('ユーザー名', () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='name']")
        validation = formWrapper.vm.$refs.nameValidation
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

      test('成功', async () => {
        // 入力データをセット
        form.setValue('テスト')

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(Object.keys(validation.failedRules).length).toBe(0)
      })
    })

    describe('メールアドレス', () => {
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

    describe('パスワード', () => {
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

      test('minエラー', async () => {
        // 入力データをセット
        form.setValue('a'.repeat(7))

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.min).toBeTruthy()
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

    describe('パスワード(確認)', () => {
      let form
      let passwordForm
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='password_confirmation']")
        passwordForm = wrapper.find("input[name='password']")
        validation = formWrapper.vm.$refs.passwordConfirmationValidation
      })

      test('requiredエラー', async () => {
        // 入力データをセット
        form.setValue('')
        passwordForm.setValue('password')

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.required).toBeTruthy()
      })

      test('minエラー', async () => {
        // 入力データをセット
        form.setValue('a'.repeat(7))
        passwordForm.setValue('password')

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.min).toBeTruthy()
      })

      test('confirmedエラー', async () => {
        // 入力データをセット
        form.setValue('password')
        passwordForm.setValue('aaaaaaaa')

        // バリデーションを実行
        await wrapper.vm.validate()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // 期待した結果になっているか
        expect(validation.failedRules.confirmed).toBeTruthy()
      })

      test('成功', async () => {
        // 入力データをセット
        form.setValue('password')
        passwordForm.setValue('password')

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
