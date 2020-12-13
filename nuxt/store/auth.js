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
  setUser(state, user) {
    state.user = user
  },

  // アクセス権限をセット
  setPermission(state, { category, permission }) {
    state.permission[category] = permission
  },

  // アクセス権限をリセット
  resetPermission(state) {
    state.permission = {}
  }
}

export const actions = {
  // ログイン
  async login({ commit }, { email, password, remember }) {
    const loginData = {
      email: email,
      password: password
    }
    // remember me にチェックが入っている場合は remember オプションを追加
    if (remember) {
      loginData.remember = remember
    }
    return await this.$axios
      .post("/api/login", loginData)
      .then(res => {
        commit("setUser", res.data)
        return res
      })
      .catch(e => {
        return e.response
      })
  },

  // ログアウト
  async logout({ commit }) {
    return await this.$axios
      .post("/api/logout")
      .then(res => {
        commit("setUser", null)
        commit("resetPermission")
        return res
      })
      .catch(e => {
        return e.response
      })
  },

  // ユーザーデータを取得してセット
  async setUser({ commit }) {
    return await this.$axios
      .get("/api/user")
      .then(res => {
        commit("setUser", res.data)
        return res
      })
      .catch(e => {
        return e.response
      })
  },

  // アクセス権限をチェック
  async checkAuth({ commit, state, getters }, category) {
    let categories = []
    if (Array.isArray(category)) {
      categories = category
    } else {
      categories = [category]
    }
    for (let value of categories) {
      if (state.user && !getters.permissionExists(value)) {
        await this.$axios
          .get("/api/permission/" + value)
          .then(res => {
            // 権限がある場合は true ない場合は false
            return res.data[0]
          })
          .catch(() => {
            return false
          })
          .then(result => {
            commit("setPermission", {
              category: value,
              permission: result
            })
          })
      }
    }
  }
}
