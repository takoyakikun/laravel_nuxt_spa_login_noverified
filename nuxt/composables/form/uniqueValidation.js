import axios from 'axios'

// ユニークのバリデーション結果をapiで取得して返す
export default () => {
  // userIDのユニーク判定を取得
  const userUnique = async loginId => {
    return await axios
      .post('/api/users/unique', { login_id: loginId })
      .then(res => {
        return Number(res.data[0]) // true/false だとバリデートされないので数値に変換
      })
  }

  return { userUnique }
}
