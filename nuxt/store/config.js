export const state = () => ({
  data: {
    role: []
  }
})

export const getters = {
  // コンフィグ
  config: state => state.data,

  // コンフィグから中身のデータを取得
  getConfigData: state => (
    name,
    search,
    getName = "text",
    searchName = "value"
  ) => {
    const data = state.data[name].find(item => item[searchName] === search)
    if (getName === "object") {
      if (data) {
        return data
      } else {
        return {}
      }
    } else {
      if (data && data[getName]) {
        return data[getName]
      } else {
        return ""
      }
    }
  }
}

export const mutations = {
  // コンフィグデータをセット
  setConfig(state, config) {
    state.data = { ...state.data, ...config }
  }
}

export const actions = {
  // APIサーバから取得したコンフィグデータをセットする
  async setConfig({ commit }) {
    return await this.$axios
      .get("/api/config")
      .then(res => {
        commit("setConfig", res.data)
        return res
      })
      .catch(e => e.response)
  }
}
