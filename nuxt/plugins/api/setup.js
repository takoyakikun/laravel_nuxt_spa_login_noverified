import api from "~/plugins/api/setModules"

export default ({ $axios, store }, inject) => {
  // headerの設定
  $axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"

  inject("api", api({ $axios, store }))
}
