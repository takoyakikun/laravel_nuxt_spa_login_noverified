import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import storeConfig from '~/test/storeConfig'
import axios from 'axios'
import VueMeta from 'vue-meta'
import api from '~/test/api'
import Index from '~/pages/index'
import Auth from '~/pages/auth'
import Login from '~/pages/login'
import Register from '~/pages/register'
import Users from '~/pages/users'
import PasswordReset from '~/pages/passwordReset/index'
import PasswordResetToken from '~/pages/passwordReset/_token'
import PasswordSetToken from '~/pages/passwordSet/_token'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueMeta, { keyName: 'head' })

const vuetify = new Vuetify()

jest.mock('vuex')

let store
let $api
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  $api = api({ $axios: axios, store })
  localVue.prototype.$api = $api
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
      getList = jest.spyOn($api.users, 'getList')
      getRoleOptions = jest.spyOn($api.users, 'getRoleOptions')

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
