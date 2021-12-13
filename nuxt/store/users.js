import * as types from './mutation-types'

export const state = () => ({
  list: [],
  roleOptions: [],
  roleFormOptions: [], // フォームの選択肢用
  userUnique: 1 // true/false だとバリデートされないので 1/0 を入れる
})

export const getters = {
  list: state => state.list,
  roleOptions: state => state.roleOptions,
  roleFormOptions: state => state.roleFormOptions,
  userUnique: state => state.userUnique
}

export const mutations = {
  // ユーザーデータをセット
  [types.USERS_SET_LIST](state, list) {
    state.list = list
  },
  // 権限の選択オプションをセット
  [types.USERS_SET_ROLE_OPTIONS](state, value) {
    state.roleOptions = value.all
    state.roleFormOptions = value.form
  },
  // ユーザーのメールアドレスがユニークかどうかの判定をセット
  [types.USERS_SET_USER_UNIQUE](state, value) {
    state.userUnique = value
  }
}
