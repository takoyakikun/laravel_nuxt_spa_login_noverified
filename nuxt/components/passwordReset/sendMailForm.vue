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
      </v-container>
    </template>
  </Form>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { createFormOptions } from '~/composition/form/createFormOptions'
import Form from '~/components/form/form'

export default defineComponent({
  name: 'passwordResetSendMailFormComponent',
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
      }
    }
    const { formOptions, validationOptions } = createFormOptions(formFields)

    return { formOptions, validationOptions }
  }
})
</script>
