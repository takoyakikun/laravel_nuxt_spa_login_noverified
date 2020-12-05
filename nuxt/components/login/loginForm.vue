<template>
  <Form @submit="$emit('submit')">
    <template>
      <ValidationField
        ref="loginValidation"
        v-model="value.email"
        :rules="{ required, max: 255, email }"
        mode="lazy"
        label="Login"
        name="login"
        type="email"
        :form-options="{
          prependIcon: 'mdi-account'
        }"
      />

      <ValidationField
        ref="passwordValidation"
        v-model="value.password"
        :rules="{ required }"
        mode="lazy"
        label="Password"
        name="password"
        type="password"
        :form-options="{
          prependIcon: 'mdi-lock'
        }"
      />

      <v-checkbox
        v-model="value.remember"
        color="primary"
        label="ログイン状態を保存する"
      />
    </template>
  </Form>
</template>

<script>
import Form from "@/components/form/form"
import ValidationField from "@/components/form/validationField"

export default {
  components: { Form, ValidationField },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
