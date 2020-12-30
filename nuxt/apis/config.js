import * as types from "@/store/mutation-types"
import path from "path"

const moduleName = "config"

export default class {
  constructor({ axios, store }) {
    this.axios = axios
    this.store = store
  }

  // コンフィグデータを取得
  getConfig() {
    return this.axios
      .get("/api/config")
      .then(res => {
        this.store.commit(
          path.join(moduleName, types.CONFIG_SET_CONFIG),
          res.data
        )
        return res
      })
      .catch(e => e.response)
  }
}
