export default {
  modules: {},

  // apiモジュールをセットする
  setApiModule(module, name) {
    // モジュールをセットする
    this.modules[name] = module
  }
}
