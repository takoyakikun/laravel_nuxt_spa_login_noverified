<template>
  <Form @submit="$emit('submit')">
    <template>
      <v-container>
        <ValidationField
          ref="emailValidation"
          v-model="value.email"
          :rules="{ required, max: 255, email }"
          mode="lazy"
          label="メールアドレス"
          name="email"
          type="email"
          :form-options="{
            prependIcon: 'mdi-email'
          }"
        />

        <ValidationField
          ref="passwordValidation"
          v-model="value.password"
          :rules="{ required, min: 8 }"
          mode="lazy"
          label="パスワード"
          name="password"
          type="password"
          :form-options="{
            prependIcon: 'mdi-lock'
          }"
        />

        <ValidationField
          ref="passwordConfirmationValidation"
          v-model="value.password_confirmation"
          :rules="{ required, min: 8, confirmed: 'password' }"
          mode="lazy"
          label="パスワード(確認)"
          name="password_confirmation"
          type="password"
          :form-options="{
            prependIcon: 'mdi-lock'
          }"
        />
      </v-container>
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
