import path from "path"

export default class {
  constructor({ axios, store }) {
    const modules = require.context(path.resolve("./apis"), false, /\.js$/)
    modules.keys().map(key => {
      const ModuleClass = modules(key).default
      this[path.basename(key, ".js")] = new ModuleClass({
        axios,
        store
      })
    })
  }
}
