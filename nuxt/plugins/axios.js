export default function({ $axios }) {
  $axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
}
