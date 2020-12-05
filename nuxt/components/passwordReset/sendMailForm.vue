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
