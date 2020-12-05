import Vue from "vue"
import {
  ValidationProvider,
  ValidationObserver,
  localize,
  extend
} from "vee-validate" // 使用する機能
import ja from "vee-validate/dist/locale/ja.json" // エラーメッセージの日本語化用
import * as rules from "vee-validate/dist/rules" // 全てのバリデーションルール

// forループで全てのバリデーションルールをextendで登録する
for (const rule in rules) {
  extend(rule, rules[rule])
}

// ユニークかどうかの判定
const unique = {
  params: ["unique"],
  message: "この{_field_}は既に使用されています",
  validate(value, { unique }) {
    return unique
  }
}
extend("unique", unique)

Vue.component("ValidationProvider", ValidationProvider)
Vue.component("ValidationObserver", ValidationObserver)
localize("ja", ja)
