import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import storeConfig from '~/test/storeConfig'
import setPlugin from '~/test/setPlugin'
import * as types from '~/store/mutation-types'
import setConfigData from '~/test/setConfigData'
import UserList from '~/components/users/userList'
import DeleteMultiDialog from '~/components/users/dialogs/deleteMultiDialog'

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit('config/' + types.CONFIG_SET_CONFIG, setConfigData)
  setPlugin(localVue)
  localVue.prototype.$nuxt.context.store = store
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  describe('テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(UserList, {
        localVue,
        store,
        vuetify
      })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test('ユーザーデータが更新されたら選択を初期化', async () => {
      // テーブルにデータを追加
      const userData = [
        {
          id: 1,
          name: 'テスト開発者',
          email: 'test_system@test.com',
          role: 1
        },
        {
          id: 2,
          name: 'テスト管理者',
          email: 'test_admin@test.com',
          role: 2
        },
        {
          id: 3,
          name: 'テスト一般',
          email: 'test_user@test.com',
          role: 3
        },
        {
          id: 4,
          name: '一般',
          email: 'user@test.com',
          role: 3
        }
      ]
      await wrapper.vm.$store.commit('users/' + types.USERS_SET_LIST, userData)

      // 選択ユーザーを追加
      wrapper.setData({
        selected: userData
      })

      // 全て選択されている
      expect(wrapper.vm.selected).toHaveLength(4)

      // 新しいユーザーデータで更新
      const newUserData = [
        {
          id: 1,
          name: 'テスト開発者',
          email: 'test_system@test.com',
          role: 1
        },
        {
          id: 2,
          name: 'テスト管理者',
          email: 'test_admin@test.com',
          role: 2
        },
        {
          id: 3,
          name: 'テスト一般',
          email: 'test_user@test.com',
          role: 3
        }
      ]
      await wrapper.vm.$store.commit(
        'users/' + types.USERS_SET_LIST,
        newUserData
      )

      // 選択が初期化されている
      expect(wrapper.vm.selected).toHaveLength(0)
    })

    describe('選択可能ユーザーの判定テスト', () => {
      test('プロパティなし', () => {
        expect(wrapper.vm.selectedUser({})).toBeFalsy()
      })

      test('全てのメニューバーアクション不可', () => {
        const user = {
          delete_flg: 0
        }
        expect(wrapper.vm.selectedUser(user)).toBeFalsy()
      })

      test('全てのメニューバーアクション可能', () => {
        const user = {
          delete_flg: 1
        }
        expect(wrapper.vm.selectedUser(user)).toBeTruthy()
      })
    })
  })

  describe('ダイアログオープンテスト', () => {
    let wrapper
    let testUser
    beforeEach(() => {
      wrapper = mount(UserList, {
        localVue,
        store,
        vuetify
      })

      // テストユーザーを追加
      testUser = {
        id: 1,
        name: 'テスト',
        email: 'test@test.com',
        role: 3,
        modify_flg: 1,
        delete_flg: 1
      }
    })

    test('新規追加ダイアログを開く', () => {
      // ダイアログを開く
      wrapper.vm.openCreateDialog()

      // ダイアログが開いている
      expect(
        wrapper.vm.$refs.createDialog.$refs.dialog.state.value
      ).toBeTruthy()
    })

    test('編集ダイアログを開く', () => {
      // ダイアログを開く
      wrapper.vm.openEditDialog(testUser)

      // ダイアログが開いている
      expect(wrapper.vm.$refs.editDialog.$refs.dialog.state.value).toBeTruthy()

      // 正しいユーザーデータが入っている
      expect(wrapper.vm.$refs.editDialog.formValue).toEqual(testUser)

      // 正しいユーザーIDが入っている
      expect(wrapper.vm.$refs.editDialog.editId).toEqual(testUser.id)
    })

    test('削除ダイアログを開く', () => {
      // ダイアログを開く
      wrapper.vm.openDeleteDialog(testUser)

      // ダイアログが開いている
      expect(
        wrapper.vm.$refs.deleteDialog.$refs.dialog.state.value
      ).toBeTruthy()

      // 正しいユーザーデータが入っている
      expect(wrapper.vm.$refs.deleteDialog.userData).toEqual(testUser)
    })

    describe('複数削除ダイアログを開く', () => {
      test('選択ユーザーなし', () => {
        // ダイアログを開く
        wrapper.vm.openDeleteMultiDialog()

        // ダイアログが開いていない
        expect(
          wrapper.vm.$refs.deleteMultiDialog.$refs.dialog.state.value
        ).toBeFalsy()
      })

      test('選択ユーザーあり', () => {
        // 選択ユーザーを追加
        wrapper
          .findComponent(DeleteMultiDialog)
          .setProps({ deleteUsers: [testUser] })

        // ダイアログを開く
        wrapper.vm.openDeleteMultiDialog()

        // ダイアログが開いている
        expect(
          wrapper.vm.$refs.deleteMultiDialog.$refs.dialog.state.value
        ).toBeTruthy()
      })
    })

    test('パスワード設定メール再送信ダイアログを開く', () => {
      // ダイアログを開く
      wrapper.vm.openPasswordSetResendDialog(testUser)

      // ダイアログが開いている
      expect(
        wrapper.vm.$refs.passwordSetResendDialog.$refs.dialog.state.value
      ).toBeTruthy()

      // 正しいユーザーデータが入っている
      expect(wrapper.vm.$refs.passwordSetResendDialog.userData).toEqual(
        testUser
      )
    })
  })

  describe('ボタン動作テスト', () => {
    let wrapper
    let openCreateDialog
    let openEditDialog
    let openDeleteDialog
    let openDeleteMultiDialog
    let openPasswordSetResendDialog
    beforeEach(() => {
      openCreateDialog = jest
        .spyOn(UserList.methods, 'openCreateDialog')
        .mockReturnValue(true)
      openEditDialog = jest
        .spyOn(UserList.methods, 'openEditDialog')
        .mockReturnValue(true)
      openDeleteDialog = jest
        .spyOn(UserList.methods, 'openDeleteDialog')
        .mockReturnValue(true)
      openDeleteMultiDialog = jest
        .spyOn(UserList.methods, 'openDeleteMultiDialog')
        .mockReturnValue(true)
      openPasswordSetResendDialog = jest
        .spyOn(UserList.methods, 'openPasswordSetResendDialog')
        .mockReturnValue(true)
      wrapper = mount(UserList, {
        localVue,
        store,
        vuetify
      })
    })

    test('新規追加ダイアログボタン', () => {
      // ボタンをクリック
      wrapper.find("[data-test='createDialogButton']").trigger('click')

      // メソッドが実行されたか
      expect(openCreateDialog).toHaveBeenCalled()
    })

    test('編集ダイアログボタン', async () => {
      // テーブルにデータを追加
      await wrapper.vm.$store.commit('users/' + types.USERS_SET_LIST, [
        {
          id: 1,
          name: 'テスト',
          email: 'test@test.com',
          role: 3,
          modify_flg: 1
        }
      ])

      // ボタンをクリック
      wrapper.find("[data-test='editDialogButton']").trigger('click')

      // メソッドが実行されたか
      expect(openEditDialog).toHaveBeenCalled()
    })

    test('削除ダイアログボタン', async () => {
      // テーブルにデータを追加
      await wrapper.vm.$store.commit('users/' + types.USERS_SET_LIST, [
        {
          id: 1,
          name: 'テスト',
          email: 'test@test.com',
          role: 3,
          delete_flg: 1
        }
      ])

      // ボタンをクリック
      wrapper.find("[data-test='deleteDialogButton']").trigger('click')

      // メソッドが実行されたか
      expect(openDeleteDialog).toHaveBeenCalled()
    })

    test('複数削除ダイアログボタン', async () => {
      // 選択ユーザーを追加
      wrapper.setData({
        selected: [
          {
            id: 1,
            name: 'テスト',
            email: 'test@test.com',
            role: 3,
            delete_flg: 1
          }
        ]
      })

      // ボタンをクリック
      wrapper.find("[data-test='deleteMultiDialogButton']").trigger('click')

      // メソッドが実行されたか
      expect(openDeleteMultiDialog).toHaveBeenCalled()
    })

    test('パスワード設定メール再送信ダイアログボタン', async () => {
      // テーブルにデータを追加
      await wrapper.vm.$store.commit('users/' + types.USERS_SET_LIST, [
        {
          id: 1,
          name: 'テスト',
          email: 'test@test.com',
          role: 3,
          delete_flg: 1
        }
      ])

      // ボタンをクリック
      wrapper.find("[data-test='passwordSetResendDialog']").trigger('click')

      // メソッドが実行されたか
      expect(openPasswordSetResendDialog).toHaveBeenCalled()
    })
  })

  describe('ユーザー検索動作テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(UserList, {
        localVue,
        store,
        vuetify
      })

      // テーブルにデータを追加
      wrapper.vm.$store.commit('users/' + types.USERS_SET_LIST, [
        {
          id: 1,
          name: 'テスト開発者',
          email: 'test_system@test.com',
          role: 1
        },
        {
          id: 2,
          name: 'テスト管理者',
          email: 'test_admin@test.com',
          role: 2
        },
        {
          id: 3,
          name: 'テスト一般',
          email: 'test_user@test.com',
          role: 3
        },
        {
          id: 4,
          name: '一般',
          email: 'user@test.com',
          role: 3
        }
      ])
    })

    test('ユーザー名検索', () => {
      let expects, results

      // 初期状態は全て表示
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchName(user.name))
      }
      expect(results).toEqual(expects)

      // 空文字の場合は全て表示
      wrapper.setData({ search: { name: '' } })
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchName(user.name))
      }
      expect(results).toEqual(expects)

      // 'テスト開発者'で検索
      wrapper.setData({ search: { name: 'テスト開発者' } })
      expects = [true, false, false, false]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchName(user.name))
      }
      expect(results).toEqual(expects)

      // 'テスト'で検索
      wrapper.setData({ search: { name: 'テスト' } })
      expects = [true, true, true, false]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchName(user.name))
      }
      expect(results).toEqual(expects)
    })

    test('メールアドレス検索', () => {
      let expects, results

      // 初期状態は全て表示
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchEmail(user.email))
      }
      expect(results).toEqual(expects)

      // 空文字の場合は全て表示
      wrapper.setData({ search: { email: '' } })
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchEmail(user.email))
      }
      expect(results).toEqual(expects)

      // 'test_system@test.com'で検索
      wrapper.setData({ search: { email: 'test_system@test.com' } })
      expects = [true, false, false, false]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchEmail(user.email))
      }
      expect(results).toEqual(expects)

      // 'user'で検索
      wrapper.setData({ search: { email: 'user' } })
      expects = [false, false, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchEmail(user.email))
      }
      expect(results).toEqual(expects)
    })

    test('アクセス権限検索', () => {
      let expects, results

      // 初期状態は全て表示
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchRole(user.role))
      }
      expect(results).toEqual(expects)

      // 未選択の場合は全て表示
      wrapper.setData({ search: { role: {} } })
      expects = [true, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchRole(user.role))
      }
      expect(results).toEqual(expects)

      // '開発者'で検索
      wrapper.setData({ search: { role: [{ value: 1 }] } })
      expects = [true, false, false, false]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchRole(user.role))
      }
      expect(results).toEqual(expects)

      // '管理者','一般'で検索
      wrapper.setData({ search: { role: [{ value: 2 }, { value: 3 }] } })
      expects = [false, true, true, true]
      results = []
      for (let user of wrapper.vm.userList) {
        results.push(wrapper.vm.searchRole(user.role))
      }
      expect(results).toEqual(expects)
    })
  })

  describe('ユーザーテーブル選択テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(UserList, {
        localVue,
        store,
        vuetify
      })

      // テーブルにデータを追加
      wrapper.vm.$store.commit('users/' + types.USERS_SET_LIST, [
        {
          id: 1,
          name: 'テスト開発者',
          email: 'test_system@test.com',
          role: 1,
          delete_flg: 0
        },
        {
          id: 2,
          name: 'テスト管理者',
          email: 'test_admin@test.com',
          role: 2,
          delete_flg: 1
        },
        {
          id: 3,
          name: 'テスト一般',
          email: 'test_user@test.com',
          role: 3,
          delete_flg: 1
        },
        {
          id: 4,
          name: '一般',
          email: 'user@test.com',
          role: 3,
          delete_flg: 1
        }
      ])
    })

    test('選択されていない', () => {
      // チェックボックスが選択されて無い
      expect(wrapper.vm.selected).toHaveLength(0)

      // アクションメニューバーが表示されていない
      expect(wrapper.vm.showSelectedBar).toBeFalsy()
    })

    test('全て選択', () => {
      // 全てのチェックボックスを選択
      wrapper.vm.selected = wrapper.vm.userList

      // id:1 以外は削除するユーザー
      expect(wrapper.vm.deleteUsers.find(item => item.id === 1)).toBeFalsy()
      expect(wrapper.vm.deleteUsers.find(item => item.id === 2)).toBeTruthy()
      expect(wrapper.vm.deleteUsers.find(item => item.id === 3)).toBeTruthy()
      expect(wrapper.vm.deleteUsers.find(item => item.id === 4)).toBeTruthy()
      expect(wrapper.vm.deleteUsers).toHaveLength(3)

      // アクションメニューバーが表示されている
      expect(wrapper.vm.showSelectedBar).toBeTruthy()

      // 複数ユーザー削除ボタンが表示されている
      expect(wrapper.vm.showDeleteMultiButton).toBeTruthy()
    })

    test('id:1 だけ選択', () => {
      // id:1 のチェックボックスを選択
      wrapper.vm.selected = wrapper.vm.userList.filter(item => item.id === 1)

      // id:1 が削除対象に入っていない
      expect(wrapper.vm.deleteUsers.find(item => item.id === 1)).toBeFalsy()
      expect(wrapper.vm.deleteUsers).toHaveLength(0)

      // アクションメニューバーが表示されていない
      expect(wrapper.vm.showSelectedBar).toBeFalsy()
    })

    test('id:2 だけ選択', () => {
      // id:2 のチェックボックスを選択
      wrapper.vm.selected = wrapper.vm.userList.filter(item => item.id === 2)

      // id:2 が削除対象に入っていない
      expect(wrapper.vm.deleteUsers.find(item => item.id === 2)).toBeTruthy()
      expect(wrapper.vm.deleteUsers).toHaveLength(1)

      // アクションメニューバーが表示されている
      expect(wrapper.vm.showSelectedBar).toBeTruthy()

      // 複数ユーザー削除ボタンが表示されている
      expect(wrapper.vm.showDeleteMultiButton).toBeTruthy()
    })
  })
})
