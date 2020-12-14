<template>
  <Form @submit="$emit('submit')">
    <template #default>
      <v-container>
        <v-row dense>
          <v-col>
            <ValidationField
              ref="nameValidation"
              v-model="value.name"
              :rules="{ required, max: 255 }"
              mode="lazy"
              name="name"
              label="ユーザー名"
              type="text"
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <ValidationField
              ref="emailValidation"
              v-model="value.email"
              :rules="{ required, max: 255, email, unique: userUnique }"
              mode="lazy"
              name="email"
              label="メールアドレス"
              type="email"
              @change="setUserUnique(value.email)"
            />
          </v-col>
        </v-row>

        <v-row v-if="!myuser" dense data-test="roleForm">
          <v-col>
            <header>アクセス権限</header>
            <ValidationField
              ref="roleValidation"
              :rules="{ required }"
              mode="lazy"
              name="role"
              label="アクセス権限"
            >
              <template v-slot="{ options, errors }">
                <v-radio-group
                  v-model="value.role"
                  v-bind="options"
                  row
                  :error-messages="errors"
                >
                  <v-radio
                    v-for="item in role"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                    color="primary"
                  />
                </v-radio-group>
              </template>
            </ValidationField>
          </v-col>
        </v-row>

        <v-row v-if="formType === 'create'" dense data-test="passwordForm">
          <v-col>
            <ValidationField
              ref="passwordValidation"
              v-model="value.password"
              :rules="{ required, min: 8 }"
              mode="lazy"
              label="パスワード"
              name="password"
              type="password"
            />
          </v-col>
        </v-row>

        <v-row
          v-if="formType === 'create'"
          dense
          data-test="passwordConfirmationForm"
        >
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
import { mapGetters, mapActions } from "vuex"
import Form from "@/components/form/form"
import ValidationField from "@/components/form/validationField"

export default {
  components: { Form, ValidationField },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    formType: {
      type: String,
      default: "create"
    },
    myuser: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      config: "config/config",
      permission: "auth/permission",
      roleOptions: "users/roleOptions",
      userUnique: "users/userUnique"
    }),

    // 権限ごとに選択できる権限を変える
    role() {
      return this.config.roleOptions.filter(item =>
        this.roleOptions.includes(item.value)
      )
    }
  },
  methods: {
    ...mapActions("users", ["setUserUnique"])
  }
}
</script>
