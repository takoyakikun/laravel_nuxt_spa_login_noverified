import { shallowMount, mount } from '@vue/test-utils'
import { localVue, router, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import * as types from '~/store/mutation-types'
import setConfigData from '~/test/setConfigData'
import SideBar from '~/components/layouts/default/sideBar'

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
  describe('テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(SideBar, {
        localVue,
        store,
        vuetify,
        propsData: {
          value: false
        }
      })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe('リンク動作テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SideBar, {
        localVue,
        store,
        router,
        vuetify,
        propsData: {
          value: false
        }
      })
    })

    test('トップページリンク', () => {
      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='topItemLink']").props().to).toBe('/')
    })

    test('認証済ページリンク', async () => {
      // ログインデータを追加
      await wrapper.vm.$store.commit('auth/' + types.AUTH_SET_USER, {
        name: 'テスト',
        email: 'test@test.com',
        role: 10
      })

      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='authItemLink']").props().to).toBe('auth')
    })

    test('ユーザー管理ページリンク', async () => {
      // 権限を管理者以上にする
      await wrapper.vm.$store.commit('auth/' + types.AUTH_SET_PERMISSION, {
        category: 'admin-higher',
        permission: true
      })

      // ログインデータを追加
      await wrapper.vm.$store.commit('auth/' + types.AUTH_SET_USER, {
        name: 'テスト',
        email: 'test@test.com',
        role: 5
      })

      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='usersItemLink']").props().to).toBe(
        'users'
      )
    })
  })

  describe('項目表示テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SideBar, {
        localVue,
        store,
        router,
        vuetify,
        propsData: {
          value: false
        }
      })
    })

    test('ログアウト', () => {
      // トップページリンク項目
      expect(wrapper.find("[data-test='topItemLink']").exists()).toBeTruthy()

      // 認証済ページリンク項目
      expect(wrapper.find("[data-test='authItemLink']").exists()).toBeFalsy()

      // ユーザー管理リンク項目
      expect(wrapper.find("[data-test='usersItemLink']").exists()).toBeFalsy()
    })

    test('一般権限', async () => {
      // ログインデータを追加
      await wrapper.vm.$store.commit('auth/' + types.AUTH_SET_USER, {
        name: 'テスト',
        email: 'test@test.com',
        role: 3
      })

      // トップページリンク項目
      expect(wrapper.find("[data-test='topItemLink']").exists()).toBeTruthy()

      // 認証済ページリンク項目
      expect(wrapper.find("[data-test='authItemLink']").exists()).toBeTruthy()

      // ユーザー管理リンク項目
      expect(wrapper.find("[data-test='usersItemLink']").exists()).toBeFalsy()
    })

    test('管理者権限', async () => {
      // 権限を管理者以上にする
      await wrapper.vm.$store.commit('auth/' + types.AUTH_SET_PERMISSION, {
        category: 'admin-higher',
        permission: true
      })

      // ログインデータを追加
      await wrapper.vm.$store.commit('auth/' + types.AUTH_SET_USER, {
        name: 'テスト',
        email: 'test@test.com',
        role: 2
      })

      // トップページリンク項目
      expect(wrapper.find("[data-test='topItemLink']").exists()).toBeTruthy()

      // 認証済ページリンク項目
      expect(wrapper.find("[data-test='authItemLink']").exists()).toBeTruthy()

      // ユーザー管理リンク項目
      expect(wrapper.find("[data-test='usersItemLink']").exists()).toBeTruthy()
    })

    test('開発者権限', async () => {
      // 権限を開発者にする
      await wrapper.vm.$store.commit('auth/' + types.AUTH_SET_PERMISSION, {
        category: 'system-only',
        permission: true
      })

      // 権限を管理者以上にする
      await wrapper.vm.$store.commit('auth/' + types.AUTH_SET_PERMISSION, {
        category: 'admin-higher',
        permission: true
      })

      // ログインデータを追加
      await wrapper.vm.$store.commit('auth/' + types.AUTH_SET_USER, {
        name: 'テスト',
        email: 'test@test.com',
        role: 1
      })

      // トップページリンク項目
      expect(wrapper.find("[data-test='topItemLink']").exists()).toBeTruthy()

      // 認証済ページリンク項目
      expect(wrapper.find("[data-test='authItemLink']").exists()).toBeTruthy()

      // ユーザー管理リンク項目
      expect(wrapper.find("[data-test='usersItemLink']").exists()).toBeTruthy()
    })
  })
})
