<template>
  <Form @submit="$emit('submit')">
    <template>
      <v-container>
        <!-- メールアドレス -->
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

        <!-- パスワード(確認) -->
        <ValidationProvider
          v-slot="props"
          ref="passwordConfirmationValidation"
          v-bind="validationOptions.password_confirmation"
        >
          <v-text-field
            v-model="value.password_confirmation"
            v-bind="formOptions.password_confirmation"
            prepend-icon="mdi-lock"
            :error-messages="props.errors"
          />
        </ValidationProvider>
      </v-container>
    </template>
  </Form>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { createFormOptions } from '~/composables/form/createFormOptions'
import Form from '~/components/form/form'

export default defineComponent({
  name: 'passwordSetFormComponent',
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
        mode: 'lazy',
        label: 'メールアドレス',
        type: 'email'
      },
      password: {
        rules: { required: true, min: 8 },
        mode: 'lazy',
        label: 'パスワード',
        type: 'password'
      },
      password_confirmation: {
        rules: { required: true, min: 8, confirmed: 'password' },
        mode: 'lazy',
        label: 'パスワード(確認)',
        type: 'password'
      }
    }
    const { formOptions, validationOptions } = createFormOptions(formFields)

    return { formOptions, validationOptions }
  }
})
</script>
