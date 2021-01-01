import path from "path"

export default class {
  constructor({ axios, store }) {
    const modules = require.context("~/apis", false, /\.js$/)
    modules.keys().map(key => {
      this[path.basename(key, ".js")] = modules(key).default(axios, store)
    })
  }
}
