<template>
  <div>
    <ValidationObserver ref="registerForm" v-slot="{ invalid }">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>新規ユーザー登録</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <UserForm
            v-model="registerFormValue"
            form-type="create"
            myuser
            @submit="submit"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn data-test="topButtonLink" to="/">
            <v-icon left>
              mdi-home
            </v-icon>
            Top
          </v-btn>
          <v-spacer />
          <v-btn
            data-test="submitButton"
            :disabled="invalid"
            :loading="loading"
            color="primary"
            @click="submit"
          >
            <v-icon left>
              mdi-account-plus
            </v-icon>
            新規登録
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </div>
</template>

<script>
import UserForm from '~/components/users/forms/userForm'

export default {
  name: 'UserRegisterComponent',
  components: {
    UserForm
  },
  data() {
    return {
      registerFormValue: {
        login_id: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    // フォームを送信
    async submit(event) {
      if (!this.loading) {
        this.loading = true
        await this.$refs.registerForm.validate().then(async result => {
          if (result) {
            await this.$api.users
              .registerData(this.registerFormValue)
              .then(async res => {
                if (res.status === 200) {
                  // ユーザー追加した後にログインする
                  await this.$api.auth
                    .login({
                      login_id: this.registerFormValue.login_id,
                      password: this.registerFormValue.password
                    })
                    .then(res => {
                      if (res.status === 200) {
                        this.$snackbar.openSnackbar({
                          text: '新規ユーザーを作成しました。',
                          options: { color: 'success' }
                        })
                        this.$router.push('/resend')
                      } else {
                        this.$snackbar.openSnackbar({
                          text: '認証に失敗しました。',
                          options: { color: 'error' }
                        })
                        this.$router.push('/login')
                      }
                    })
                } else {
                  this.$snackbar.openSnackbar({
                    text: '新規ユーザーの作成に失敗しました。',
                    options: { color: 'error' }
                  })
                }
              })
          }
        })
        this.loading = false
      }
    }
  }
}
</script>
