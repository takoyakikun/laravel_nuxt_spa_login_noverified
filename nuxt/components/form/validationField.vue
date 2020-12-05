<template>
  <div>
    <ValidationProvider
      v-slot="props"
      ref="validation"
      v-bind="createValidationOptions"
    >
      <slot :options="createFormOptions" v-bind="props">
        <v-textarea
          v-if="type === 'textarea'"
          :value="value"
          v-bind="createFormOptions"
          :error-messages="props.errors"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
          @blur="$emit('blur', $event)"
          @click="$emit('click', $event)"
          @focus="$emit('focus', $event)"
          @keydown="$emit('keydown', $event)"
          @mousedown="$emit('mousedown', $event)"
          @mouseup="$emit('mouseup', $event)"
          @update="$emit('update', $event)"
        />
        <v-text-field
          v-else
          :value="value"
          v-bind="createFormOptions"
          :error-messages="props.errors"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
          @blur="$emit('blur', $event)"
          @click="$emit('click', $event)"
          @focus="$emit('focus', $event)"
          @keydown="$emit('keydown', $event)"
          @mousedown="$emit('mousedown', $event)"
          @mouseup="$emit('mouseup', $event)"
          @update="$emit('update', $event)"
        />
      </slot>
    </ValidationProvider>
  </div>
</template>

<script>
import lodash from "lodash"

export default {
  props: {
    value: {
      type: [Number, String, Array, Object],
      default: ""
    },
    rules: {
      type: [Object, String],
      default: () => ({})
    },
    mode: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    label: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    validationOptions: {
      type: Object,
      default: () => ({})
    },
    formOptions: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // バリデーションのオプションを生成
    createValidationOptions() {
      let options = lodash.cloneDeep(this.validationOptions)
      if (Object.keys(this.rules).length) {
        options.rules = lodash.cloneDeep(this.rules)
      }
      if (this.mode) {
        options.mode = this.mode
      }
      if (this.label) {
        options.name = this.label
      }
      if (this.name) {
        options.vid = this.name
      }
      return options
    },

    // フォームフィールドのオプションを生成
    createFormOptions() {
      let options = lodash.cloneDeep(this.formOptions)
      options.type = this.type
      if (this.label) {
        options.label = this.label
      }
      if (this.name) {
        options.name = this.name
      }
      let rules = lodash.cloneDeep(this.rules)
      if (this.validationOptions.rules) {
        rules = lodash.cloneDeep(this.validationOptions.rules)
      }
      const setRule = {
        required() {
          options.required = true
        },
        max_value() {
          options.max = rules["max_value"]
        },
        min_value() {
          options.min = rules["min_value"]
        }
      }
      for (let key in rules) {
        if (Object.keys(setRule).includes(key)) {
          setRule[key]()
        }
      }
      return options
    }
  },
  methods: {
    validate(value) {
      if (value) {
        return this.$refs.validation.validate(value)
      } else {
        return this.$refs.validation.validate()
      }
    },
    validateSilent() {
      return this.$refs.validation.validateSilent()
    },
    applyResult(ValidationResult) {
      return this.$refs.validation.applyResult(ValidationResult)
    },
    reset() {
      return this.$refs.validation.reset()
    },
    setFlags(flags) {
      return this.$refs.validation.setFlags(flags)
    },
    setErrors(errors) {
      return this.$refs.validation.setErrors(errors)
    },
    syncValue(value) {
      return this.$refs.validation.syncValue(value)
    },

    // エラー内容を取得
    getFailedRules() {
      return this.$refs.validation.failedRules
    }
  }
}
</script>
