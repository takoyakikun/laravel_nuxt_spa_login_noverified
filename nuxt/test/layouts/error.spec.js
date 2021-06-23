import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import Error from '~/layouts/error'

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
      vuetify,
      propsData: {
        error: {
          statusCode: 404
        }
      },
      stubs: {
        NuxtLink: RouterLinkStub,
        nuxt: true
      }
    }
  })

  describe('', () => {
    beforeEach(() => {
      wrapper = shallowMount(Error, mountOptions)
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test('statusCodeが404', () => {
      // statusCodeを404にする
      wrapper.setProps({
        error: {
          statusCode: 404
        }
      })

      // "404 Not Found" を返す
      const head = wrapper.vm.$options.head.call(wrapper.vm)
      expect(head.title).toBe('404 Not Found')
    })

    test('statusCodeが404以外', () => {
      // statusCodeを404以外にする
      wrapper.setProps({
        error: {
          statusCode: 403
        }
      })

      // "An error occurred" を返す
      const head = wrapper.vm.$options.head.call(wrapper.vm)
      expect(head.title).toBe('An error occurred')
    })
  })
})
