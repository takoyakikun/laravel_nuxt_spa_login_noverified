import * as types from '@/store/mutation-types'
import path from 'path'

const moduleName = 'config'

export default (axios, store) => ({
  // コンフィグデータを取得
  getConfig() {
    return axios
      .get('/api/config')
      .then(res => {
        store.commit(path.join(moduleName, types.CONFIG_SET_CONFIG), res.data)
        return res
      })
      .catch(e => e.response)
  }
})
