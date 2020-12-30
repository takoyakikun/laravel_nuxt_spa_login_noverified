import ApiClass from "@/plugins/api/apiClass"

export default function({ $axios, store }, inject) {
  $axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"

  const api = new ApiClass({ axios: $axios, store })
  inject("api", api)
}
