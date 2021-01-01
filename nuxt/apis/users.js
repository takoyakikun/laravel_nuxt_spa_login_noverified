import * as types from "@/store/mutation-types"
import path from "path"

const moduleName = "users"

export default (axios, store) => ({
  // データの取得
  async getList() {
    return await axios
      .get("/api/users")
      .then(res => {
        store.commit(path.join(moduleName, types.USERS_SET_LIST), res.data)
        return res
      })
      .catch(err => err.response)
  },

  // 新規作成ページから新規ユーザー作成
  async registerData(formValue) {
    return await axios
      .post("/api/register", formValue)
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },

  // ユーザー管理から新規ユーザー作成
  async createData(formValue) {
    return await axios
      .post("/api/users", formValue)
      .then(res => {
        this.getList()
        return res
      })
      .catch(err => err.response)
  },

  // 認証メール再送信
  async resendMail() {
    return await axios
      .post("/api/email/resend")
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },

  // データ更新
  async editData({ formValue, id }) {
    // id がある場合は指定したユーザーを変更、ない場合は自分のユーザーを変更
    if (id) {
      return await axios
        .patch("/api/users/" + id, formValue)
        .then(res => {
          this.getList()
          return res
        })
        .catch(err => err.response)
    } else {
      return await axios
        .patch("/api/myuser/update", formValue)
        .then(res => {
          // 管理者権限以上は全ユーザーデータを再取得
          if (store.getters["auth/permission"]("admin-higher")) {
            this.getList()
          }
          return res
        })
        .catch(err => err.response)
    }
  },

  // データ削除
  async deleteData(id) {
    return await axios
      .delete("/api/users/" + id)
      .then(res => {
        this.getList()
        return res
      })
      .catch(err => err.response)
  },

  // 複数データ削除
  async deleteMultiData(idList) {
    return await axios
      .delete("/api/users/" + JSON.stringify(idList))
      .then(res => {
        this.getList()
        return res
      })
      .catch(err => err.response)
  },

  // パスワード変更
  async passwordChange(formValue) {
    return await axios
      .patch("/api/myuser/passwordChange", formValue)
      .then(res => {
        this.getList()
        return res
      })
      .catch(err => err.response)
  },

  // パスワードリセットメール送信
  async passwordResetMail(formValue) {
    return await axios
      .post("/api/password/email", formValue)
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },

  // パスワードリセット
  async passwordReset(formValue) {
    return await axios
      .post("/api/password/reset", formValue)
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },

  // パスワードセットメール再送信
  async passwordSetResend(id) {
    return await axios
      .post("/api/users/passwordSetResend/" + id)
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },

  // パスワードセット
  async passwordSet(formValue) {
    return await axios
      .post("/api/password/passwordSet", formValue)
      .then(res => {
        return res
      })
      .catch(err => err.response)
  },

  // 権限の選択オプションをセット
  async getRoleOptions() {
    return await axios
      .get("/api/users/roleOptions")
      .then(res => {
        store.commit(
          path.join(moduleName, types.USERS_SET_ROLE_OPTIONS),
          res.data
        )
        return res
      })
      .catch(err => err.response)
  },

  // ユーザーのメールアドレスがユニークかどうかの判定をセット
  async getUserUnique(email) {
    return await axios.post("/api/users/unique", { email: email }).then(res => {
      store.commit(
        path.join(moduleName, types.USERS_SET_USER_UNIQUE),
        Number(res.data[0]) // true/false だとバリデートされないので数値に変換
      )
    })
  }
})
