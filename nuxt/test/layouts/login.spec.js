import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import storeConfig from '~/test/storeConfig'
import Login from '~/layouts/login'

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
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
      wrapper = shallowMount(Login, mountOptions)
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })
})
