<template>
  <Form @submit="$emit('submit')">
    <template>
      <v-container>
        <v-row dense>
          <v-col>
            <ValidationField
              ref="currentPasswordValidation"
              v-model="value.current_password"
              :rules="{ required }"
              mode="lazy"
              label="現在のパスワード"
              name="current_password"
              type="password"
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <ValidationField
              ref="passwordValidation"
              v-model="value.password"
              :rules="{ required, min: 8 }"
              mode="lazy"
              label="変更後のパスワード"
              name="password"
              type="password"
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <ValidationField
              ref="passwordConfirmationValidation"
              v-model="value.password_confirmation"
              :rules="{ required, min: 8, confirmed: 'password' }"
              mode="lazy"
              label="パスワード(確認)"
              name="password_confirmation"
              type="password"
            />
          </v-col>
        </v-row>
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
