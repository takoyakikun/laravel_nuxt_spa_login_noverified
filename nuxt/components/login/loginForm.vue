<template>
  <Form @submit="$emit('submit')">
    <template>
      <!-- Loginメールアドレス -->
      <ValidationProvider
        v-slot="props"
        ref="loginValidation"
        v-bind="validationOptions.login"
      >
        <v-text-field
          v-model="value.email"
          v-bind="formOptions.login"
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
import { defineComponent } from "@nuxtjs/composition-api"
import { createFormOptions } from "~/composition/form/createFormOptions"
import Form from "~/components/form/form"

export default defineComponent({
  name: "loginFormComponent",
  components: { Form },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const formFields = {
      login: {
        rules: { required: true, max: 255, email: true },
        mode: "lazy",
        label: "Login",
        type: "email"
      },
      password: {
        rules: { required: true },
        mode: "lazy",
        label: "Password",
        type: "password"
      },
      remember: {
        label: "ログイン状態を保存する"
      }
    }
    const { formOptions, validationOptions } = createFormOptions(formFields)

    return { formOptions, validationOptions }
  }
})
</script>
