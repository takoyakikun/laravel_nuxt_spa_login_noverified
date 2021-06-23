import { shallowMount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import Index from '~/pages/index'
import Auth from '~/pages/auth'
import Login from '~/pages/login'
import Register from '~/pages/register'
import Users from '~/pages/users'
import PasswordReset from '~/pages/passwordReset/index'
import PasswordResetToken from '~/pages/passwordReset/_token'
import PasswordSetToken from '~/pages/passwordSet/_token'

jest.mock('vuex')

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
  describe('index', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(Index, { localVue, store, vuetify })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe('auth', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(Auth, { localVue, store, vuetify })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test('authミドルウェアが登録されているか', () => {
      expect(wrapper.vm.$options.middleware).toContain('auth')
    })
  })

  describe('login', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(Login, { localVue, store, vuetify })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test('guestミドルウェアが登録されているか', () => {
      expect(wrapper.vm.$options.middleware).toContain('guest')
    })
  })

  describe('register', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(Register, { localVue, store, vuetify })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test('guestミドルウェアが登録されているか', () => {
      expect(wrapper.vm.$options.middleware).toContain('guest')
    })
  })

  describe('users', () => {
    let wrapper
    let getList
    let getRoleOptions
    beforeEach(() => {
      // spyOn
      getList = jest.spyOn(localVue.prototype.$api.users, 'getList')
      getRoleOptions = jest.spyOn(
        localVue.prototype.$api.users,
        'getRoleOptions'
      )

      wrapper = shallowMount(Users, { localVue, store, vuetify })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test('adminミドルウェアが登録されているか', () => {
      expect(wrapper.vm.$options.middleware).toContain('admin')
    })

    test('createdが実行されているか', () => {
      // createdのdispatchが実行されているか
      expect(getList).toHaveBeenCalled()
      expect(getRoleOptions).toHaveBeenCalled()
    })
  })

  describe('passwordReset', () => {
    describe('index', () => {
      let wrapper
      beforeEach(() => {
        wrapper = shallowMount(PasswordReset, { localVue, store, vuetify })
      })

      test('is a Vue instance', () => {
        expect(wrapper.vm).toBeTruthy()
      })

      test('guestミドルウェアが登録されているか', () => {
        expect(wrapper.vm.$options.middleware).toContain('guest')
      })
    })

    describe('_token', () => {
      let wrapper
      beforeEach(() => {
        wrapper = shallowMount(PasswordResetToken, { localVue, store, vuetify })
      })

      test('is a Vue instance', () => {
        expect(wrapper.vm).toBeTruthy()
      })

      test('guestミドルウェアが登録されているか', () => {
        expect(wrapper.vm.$options.middleware).toContain('guest')
      })
    })

    describe('passwordSet', () => {
      describe('_token', () => {
        let wrapper
        beforeEach(() => {
          wrapper = shallowMount(PasswordSetToken, { localVue, store, vuetify })
        })

        test('is a Vue instance', () => {
          expect(wrapper.vm).toBeTruthy()
        })

        test('guestミドルウェアが登録されているか', () => {
          expect(wrapper.vm.$options.middleware).toContain('guest')
        })
      })
    })
  })
})
