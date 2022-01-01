<template>
  <Form @submit="$emit('submit')">
    <template #default>
      <v-container>
        <v-row dense>
          <v-col>
            <!-- ユーザー名 -->
            <ValidationProvider
              v-slot="props"
              ref="nameValidation"
              v-bind="validationOptions.name"
            >
              <v-text-field
                v-model="value.name"
                v-bind="formOptions.name"
                :error-messages="props.errors"
              />
            </ValidationProvider>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <!-- メールアドレス -->
            <ValidationProvider
              v-slot="props"
              ref="loginIdValidation"
              v-bind="validationOptions.login_id"
            >
              <v-text-field
                v-model="value.login_id"
                v-bind="formOptions.login_id"
                :error-messages="props.errors"
                @change="$api.users.getUserUnique(value.login_id)"
              />
            </ValidationProvider>
          </v-col>
        </v-row>

        <v-row v-if="!props.myuser" dense data-test="roleForm">
          <v-col>
            <!-- アクセス権限 -->
            <header>アクセス権限</header>
            <ValidationProvider
              v-slot="props"
              ref="roleValidation"
              v-bind="validationOptions.role"
            >
              <v-radio-group
                v-model="value.role"
                v-bind="formOptions.role"
                row
                :error-messages="props.errors"
              >
                <v-radio
                  v-for="item in state.roleOptions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                  color="primary"
                />
              </v-radio-group>
            </ValidationProvider>
          </v-col>
        </v-row>

        <v-row
          v-if="props.formType === 'create'"
          dense
          data-test="passwordForm"
        >
          <v-col>
            <!-- パスワード -->
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

        <v-row
          v-if="formType === 'create'"
          dense
          data-test="passwordConfirmationForm"
        >
          <v-col>
            <!-- パスワード(確認) -->
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
import {
  defineComponent,
  useContext,
  reactive,
  computed
} from '@nuxtjs/composition-api'

import { createFormOptions } from '~/composables/form/createFormOptions'
import UniqueValidation from '~/composables/form/uniqueValidation'
import Form from '~/components/form/form'

export default defineComponent({
  name: 'userFormComponent',
  components: { Form },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    formType: {
      type: String,
      default: 'create'
    },
    myuser: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const { store } = useContext()

    const roleOptions = computed(() => store.getters['users/roleFormOptions'])
    const userUnique = computed(() => store.getters['users/userUnique'])
    const state = reactive({
      roleOptions,
      userUnique
    })

    const { userUnique } = UniqueValidation()
    console.log(UniqueValidation(), userUnique)
    const formFields = {
      name: {
        rules: { required: true, max: 255 },
        mode: 'lazy',
        label: 'ユーザー名',
        type: 'text'
      },
      login_id: {
        rules: {
          required: true,
          max: 255,
          email: true,
          unique: state.userUnique
        },
        mode: 'lazy',
        label: 'メールアドレス',
        type: 'email'
      },
      role: {
        rules: { required: true },
        mode: 'lazy'
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

    return { props, state, formOptions, validationOptions }
  }
})
</script>
