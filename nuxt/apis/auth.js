import * as types from "@/store/mutation-types"
import path from "path"

const moduleName = "auth"

export default class {
  constructor({ axios, store }) {
    this.axios = axios
    this.store = store
  }

  // ログイン
  async login({ email, password, remember }) {
    const loginData = {
      email: email,
      password: password
    }
    // remember me にチェックが入っている場合は remember オプションを追加
    if (remember) {
      loginData.remember = remember
    }
    return await this.axios
      .post("/api/login", loginData)
      .then(res => {
        this.store.commit(path.join(moduleName, types.AUTH_SET_USER), res.data)
        return res
      })
      .catch(e => e.response)
  }

  // ログアウト
  async logout() {
    return await this.axios
      .post("/api/logout")
      .then(res => {
        this.store.commit(path.join(moduleName, types.AUTH_SET_USER), null)
        this.store.commit(path.join(moduleName, types.AUTH_RESET_PERMISSION))
        return res
      })
      .catch(e => e.response)
  }

  // ユーザーデータを取得
  async getUser() {
    return await this.axios
      .get("/api/user")
      .then(res => {
        this.store.commit(path.join(moduleName, types.AUTH_SET_USER), res.data)
        return res
      })
      .catch(e => e.response)
  }

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
        this.store.getters[path.join(moduleName, "user")] &&
        !this.store.getters[path.join(moduleName, "permission")](value)
      ) {
        await this.axios
          .get("/api/permission/" + value)
          .then(res => {
            // 権限がある場合は true ない場合は false
            return res.data[0]
          })
          .catch(() => {
            return false
          })
          .then(result => {
            this.store.commit(
              path.join(moduleName, types.AUTH_SET_PERMISSION),
              {
                category: value,
                permission: result
              }
            )
          })
      }
    }
  }
}
