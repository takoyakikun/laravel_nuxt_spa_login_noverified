---
to: "<%= test ? ('test/pages/' + directory + '/' + (name ? name : 'index') + '.spec.js') : null %>"
---
import { shallowMount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import Page from '~/components/<%= directory %>/<%= name ? name : "index" %>'

jest.useFakeTimers()
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
  let mountOptions
  beforeEach(() => {
    mountOptions = {
      localVue,
      store,
      vuetify
    }
  })

  test('is a Vue instance', () => {
    const wrapper = shallowMount(Page, mountOptions)

    expect(wrapper.vm).toBeTruthy()
  })

  test('<%= middleware %>ミドルウェアが登録されているか', () => {
    const wrapper = shallowMount(Page, mountOptions)

    expect(wrapper.vm.$options.middleware).toContain('<%= middleware %>')
  })
})
