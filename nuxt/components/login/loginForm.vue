<template>
  <Form @submit="$emit('submit')">
    <template>
      <!-- Loginメールアドレス -->
      <ValidationProvider
        v-slot="props"
        ref="loginIdValidation"
        v-bind="validationOptions.login_id"
      >
        <v-text-field
          v-model="value.login_id"
          v-bind="formOptions.login_id"
          prepend-icon="mdi-account"
          :error-messages="props.errors"
        />
      </ValidationProvider>

      <!-- パスワード -->
      <ValidationProvider
        v-slot="props"
        ref="passwordValidation"
        v-bind="validationOptions.password"
      >
        <v-text-field
          v-model="value.password"
          v-bind="formOptions.password"
          prepend-icon="mdi-lock"
          :error-messages="props.errors"
        />
      </ValidationProvider>

      <!-- ログイン状態を保存する -->
      <v-checkbox
        v-model="value.remember"
        color="primary"
        v-bind="formOptions.remember"
      />
    </template>
  </Form>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { createFormOptions } from '~/composables/form/createFormOptions'
import Form from '~/components/form/form'

export default defineComponent({
  name: 'loginFormComponent',
  components: { Form },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const formFields = {
      login_id: {
        rules: { required: true, max: 255, email: true },
        mode: 'eager',
        label: 'Login',
        type: 'email'
      },
      password: {
        rules: { required: true },
        mode: 'eager',
        label: 'Password',
        type: 'password'
      },
      remember: {
        label: 'ログイン状態を保存する'
      }
    }
    const { formOptions, validationOptions } = createFormOptions(formFields)

    return { formOptions, validationOptions }
  }
})
</script>
