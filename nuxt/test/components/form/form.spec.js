import { shallowMount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import Form from '~/components/form/form'

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
      vuetify
    }
  })

  describe('', () => {
    beforeEach(() => {
      wrapper = shallowMount(Form, mountOptions)
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test('フォーム送信', () => {
      // フォーム送信
      wrapper.vm.methods.submit()

      // submitがemitされている
      expect(wrapper.emitted().submit).toBeTruthy()
    })
  })
})
