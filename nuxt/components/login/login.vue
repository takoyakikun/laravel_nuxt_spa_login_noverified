<template>
  <div>
    <ValidationObserver ref="loginForm" v-slot="{ invalid }">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <LoginForm v-model="loginForm" @submit="submit" />
          <nuxt-link
            data-test="passwordResetLink"
            to="passwordReset"
            @click.native="$router.push('passwordReset')"
          >
            パスワードを忘れた方はこちら
          </nuxt-link>
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
            data-test="loginButton"
            :disabled="invalid"
            :loading="loading"
            color="primary"
            @click="submit"
          >
            <v-icon left>
              mdi-login-variant
            </v-icon>
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </div>
</template>

<script>
import LoginForm from '~/components/login/loginForm'

export default {
  name: 'LoginComponent',
  components: {
    LoginForm
  },
  data() {
    return {
      loginForm: {
        login_id: '',
        password: '',
        remember: false
      },
      loading: false
    }
  },
  methods: {
    // ログイン処理
    async submit() {
      if (!this.loading) {
        this.loading = true
        await this.$refs.loginForm.validate().then(async result => {
          if (result) {
            await this.$api.auth
              .login({
                login_id: this.loginForm.login_id,
                password: this.loginForm.password,
                remember: this.loginForm.remember
              })
              .then(res => {
                if (res.status === 200) {
                  this.$router.push('/')
                } else {
                  this.loginForm.password = ''
                  this.$refs.loginForm.reset()
                  this.$snackbar.openSnackbar({
                    text: '認証に失敗しました。',
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
