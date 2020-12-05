export const state = () => ({
  list: [],
  roleOptions: [],
  userUnique: 1 // true/false だとバリデートされないので 1/0 を入れる
})

export const getters = {
  list: state => state.list,
  roleOptions: state => state.roleOptions,
  userUnique: state => state.userUnique
}

export const mutations = {
  // ユーザーデータをセット
  setList(state, list) {
    state.list = list
  },
  // 権限の選択オプションをセット
  setRoleOptions(state, value) {
    state.roleOptions = value
  },
  // ユーザーのメールアドレスがユニークかどうかの判定をセット
  setUserUnique(state, value) {
    state.userUnique = value
  }
}

export const actions = {
  // データの取得
  async setList({ commit }) {
    return await this.$axios
      .get("/api/users")
      .then(res => {
        commit("setList", res.data)
        return res
      })
      .catch(err => err.response)
  },
  // 新規作成ページから新規ユーザー作成
  async registerData({ dispatch }, formValue) {
    return await this.$axios
      .post("/api/register", formValue)
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },
  // ユーザー管理から新規ユーザー作成
  async createData({ dispatch }, formValue) {
    return await this.$axios
      .post("/api/users", formValue)
      .then(res => {
        dispatch("setList")
        return res
      })
      .catch(err => err.response)
  },
  // 認証メール再送信
  async resendMail({ dispatch }) {
    return await this.$axios
      .post("/api/email/resend")
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },
  // データ更新
  async editData({ dispatch, rootGetters }, { formValue, id }) {
    // id がある場合は指定したユーザーを変更、ない場合は自分のユーザーを変更
    if (id) {
      return await this.$axios
        .patch("/api/users/" + id, formValue)
        .then(res => {
          dispatch("setList")
          return res
        })
        .catch(err => err.response)
    } else {
      return await this.$axios
        .patch("/api/myuser/update", formValue)
        .then(res => {
          // 管理者権限以上は全ユーザーデータを再取得
          if (rootGetters["auth/permission"]("admin-higher")) {
            dispatch("setList")
          }
          return res
        })
        .catch(err => err.response)
    }
  },
  // データ削除
  async deleteData({ dispatch }, id) {
    return await this.$axios
      .delete("/api/users/" + id)
      .then(res => {
        dispatch("setList")
        return res
      })
      .catch(err => err.response)
  },
  // パスワード変更
  async passwordChange({ dispatch }, formValue) {
    return await this.$axios
      .patch("/api/myuser/passwordChange", formValue)
      .then(res => {
        dispatch("setList")
        return res
      })
      .catch(err => err.response)
  },
  // パスワードリセットメール送信
  async passwordResetMail({ dispatch }, formValue) {
    return await this.$axios
      .post("/api/password/email", formValue)
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },
  // パスワードリセット
  async passwordReset({ dispatch }, formValue) {
    return await this.$axios
      .post("/api/password/reset", formValue)
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },
  // パスワードセット
  async passwordSet({ dispatch }, formValue) {
    return await this.$axios
      .post("/api/password/passwordSet", formValue)
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },
  // 権限の選択オプションをセット
  async setRoleOptions({ commit }) {
    return await this.$axios
      .get("/api/users/roleOptions")
      .then(res => {
        commit("setRoleOptions", res.data)
        return res
      })
      .catch(err => err.response)
  },
  // ユーザーのメールアドレスがユニークかどうかの判定をセット
  async setUserUnique({ commit }, email) {
    return await this.$axios
      .post("/api/users/unique", { email: email })
      .then(res => {
        commit("setUserUnique", 1) // true だとバリデートされないので 1 を入れる
      })
      .catch(err => {
        // バリデーションエラーの時のみfalse
        if (err.response.status === 422) {
          commit("setUserUnique", 0) // false だとバリデートされないので 0 を入れる
        }
      })
  }
}
