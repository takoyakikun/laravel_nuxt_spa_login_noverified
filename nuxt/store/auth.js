import * as types from './mutation-types'

export const state = () => ({
  user: null,
  permission: {}
})

export const getters = {
  // ユーザーデータを取得
  user: (state, getters) => {
    if (getters.userExists) {
      return state.user
    } else {
      return {}
    }
  },
  // ユーザーデータが存在しているか
  userExists: state => Boolean(state.user),

  // アクセス許可を返す
  permission: (state, getters) => category => {
    if (getters.permissionExists(category)) {
      return state.permission[category]
    } else {
      return false
    }
  },
  // アクセスデータが存在しているか
  permissionExists: state => category => category in state.permission
}

export const mutations = {
  // ユーザーデータをセット
  [types.AUTH_SET_USER](state, user) {
    state.user = user
  },

  // アクセス権限をセット
  [types.AUTH_SET_PERMISSION](state, { category, permission }) {
    state.permission[category] = permission
  },

  // アクセス権限をリセット
  [types.AUTH_RESET_PERMISSION](state) {
    state.permission = {}
  }
}
