<template>
  <Form @submit="$emit('submit')">
    <template>
      <v-container>
        <v-row dense>
          <v-col>
            <!-- 現在のパスワード -->
            <ValidationProvider
              v-slot="props"
              ref="currentPasswordValidation"
              v-bind="validationOptions.current_password"
            >
              <v-text-field
                v-model="value.current_password"
                v-bind="formOptions.current_password"
                :error-messages="props.errors"
              />
            </ValidationProvider>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <!-- 変更後のパスワード -->
            <ValidationProvider
              v-slot="props"
              ref="passwordValidation"
              v-bind="validationOptions.password"
            >
              <v-text-field
                v-model="value.password"
                v-bind="formOptions.password"
                :error-messages="props.errors"
              />
            </ValidationProvider>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <!-- 変更後のパスワード(確認) -->
            <ValidationProvider
              v-slot="props"
              ref="passwordConfirmationValidation"
              v-bind="validationOptions.password_confirmation"
            >
              <v-text-field
                v-model="value.password_confirmation"
                v-bind="formOptions.password_confirmation"
                :error-messages="props.errors"
              />
            </ValidationProvider>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </Form>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { createFormOptions } from '~/composables/form/createFormOptions'
import Form from '~/components/form/form'

export default defineComponent({
  name: 'passwordChangeFormComponent',
  components: { Form },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const formFields = {
      current_password: {
        rules: { required: true },
        mode: 'lazy',
        label: '現在のパスワード',
        type: 'password'
      },
      password: {
        rules: { required: true, min: 8 },
        mode: 'lazy',
        label: '変更後のパスワード',
        type: 'password'
      },
      password_confirmation: {
        rules: { required: true, min: 8, confirmed: 'password' },
        mode: 'lazy',
        label: '変更後のパスワード(確認)',
        type: 'password'
      }
    }
    const { formOptions, validationOptions } = createFormOptions(formFields)

    return { formOptions, validationOptions }
  }
})
</script>
