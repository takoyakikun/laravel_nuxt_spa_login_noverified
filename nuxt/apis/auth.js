import * as types from '@/store/mutation-types'
import path from 'path'

const moduleName = 'auth'

export default (axios, store) => ({
  // ログイン
  async login({ login_id, password, remember }) {
    const loginData = {
      login_id: login_id,
      password: password
    }
    // remember me にチェックが入っている場合は remember オプションを追加
    if (remember) {
      loginData.remember = remember
    }
    return await axios
      .post('/api/login', loginData)
      .then(res => {
        store.commit(path.join(moduleName, types.AUTH_SET_USER), res.data)
        return res
      })
      .catch(e => e.response)
  },

  // ログアウト
  async logout() {
    return await axios
      .post('/api/logout')
      .then(res => {
        store.commit(path.join(moduleName, types.AUTH_SET_USER), null)
        store.commit(path.join(moduleName, types.AUTH_RESET_PERMISSION))
        return res
      })
      .catch(e => e.response)
  },

  // ユーザーデータを取得
  async getUser() {
    return await axios
      .get('/api/user')
      .then(res => {
        store.commit(path.join(moduleName, types.AUTH_SET_USER), res.data)
        return res
      })
      .catch(e => e.response)
  },

  // アクセス権限をチェック
  async checkAuth(category) {
    let categories = []
    if (Array.isArray(category)) {
      categories = category
    } else {
      categories = [category]
    }
    for (let value of categories) {
      if (
        store.getters[path.join(moduleName, 'userExists')] &&
        !store.getters[path.join(moduleName, 'permission')](value)
      ) {
        await axios
          .get('/api/permission/' + value)
          .then(res => {
            // 権限がある場合は true ない場合は false
            return res.data[0]
          })
          .catch(() => {
            return false
          })
          .then(result => {
            store.commit(path.join(moduleName, types.AUTH_SET_PERMISSION), {
              category: value,
              permission: result
            })
          })
      }
    }
  }
})
