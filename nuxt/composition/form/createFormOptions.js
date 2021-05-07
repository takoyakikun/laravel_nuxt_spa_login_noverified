import lodash from 'lodash'

/*
下記の様にフォームフィールドデータを設定するとバリデーションとフォームフィールドのオプションデータが生成される
formFields = {
  [name]: {
    rules: { required: true, max: 255 },
    mode: "lazy",
    label: "ラベル名",
    type: "text"
  },
}
*/
export const createFormOptions = formFields => {
  // バリデーションのオプションを生成
  const validationOptions = Object.fromEntries(
    Object.entries(formFields).map(([fieldName, field]) => {
      let options = {}
      options.vid = fieldName
      if (field.rules && Object.keys(field.rules).length) {
        options.rules = lodash.cloneDeep(field.rules)
      }
      if (field.mode) {
        options.mode = field.mode
      }
      if (field.label) {
        options.name = field.label
      } else {
        options.name = fieldName
      }
      return [fieldName, options]
    })
  )

  // フォームフィールドのオプションを生成
  const formOptions = Object.fromEntries(
    Object.entries(formFields).map(([fieldName, field]) => {
      let options = {}
      options.name = fieldName
      if (field.type) {
        options.type = field.type
      }
      if (field.label) {
        options.label = field.label
      }

      // バリデーションルールに合わせてフォームオプションを追加する
      if (field.rules) {
        let rules = lodash.cloneDeep(field.rules)
        const setRule = {
          required() {
            options.required = true
          },
          max_value() {
            options.max = rules['max_value']
          },
          min_value() {
            options.min = rules['min_value']
          }
        }
        for (let key in rules) {
          if (Object.keys(setRule).includes(key)) {
            setRule[key]()
          }
        }
      }
      return [fieldName, options]
    })
  )
  return { validationOptions, formOptions }
}
