---
to: "<%= test ? ('test/components/' + directory + '/' + (name ? name : 'index') + '.spec.js') : null %>"
---
import { shallowMount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import * as types from '~/store/mutation-types'
import setConfigData from '~/test/setConfigData'
import <%= h.changeCase.pascal(name) %> from '~/components/<%= directory %>/<%= name ? name : "index" %>'

jest.useFakeTimers()
jest.mock('vuex')
jest.mock('axios')

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
      vuetify
    }
  })

  test('is a Vue instance', () => {
    const wrapper = shallowMount(<%= h.changeCase.pascal(name) %>, mountOptions)

    expect(wrapper.vm).toBeTruthy()
  })

})
