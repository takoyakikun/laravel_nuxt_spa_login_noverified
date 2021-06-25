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

  test('is a Vue instance', () => {
    wrapper = shallowMount(Error, mountOptions)

    expect(wrapper.vm).toBeTruthy()
  })

  test('statusCodeが404', () => {
    // statusCodeを404にする
    mountOptions.propsData = {
      error: {
        statusCode: 404
      }
    }

    wrapper = shallowMount(Error, mountOptions)

    // "404 Not Found" を返す
    const head = wrapper.vm.$options.head.call(wrapper.vm)
    expect(head.title).toBe('404 Not Found')
  })

  test('statusCodeが404以外', () => {
    // statusCodeを404以外にする
    mountOptions.propsData = {
      error: {
        statusCode: 403
      }
    }

    wrapper = shallowMount(Error, mountOptions)

    // "An error occurred" を返す
    const head = wrapper.vm.$options.head.call(wrapper.vm)
    expect(head.title).toBe('An error occurred')
  })
})
