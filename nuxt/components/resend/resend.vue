<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>メールアドレスの認証</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-alert v-show="resend" outlined type="success" text>
        新規認証メールを再送信しました。
      </v-alert>
      このページを閲覧するには、Eメールによる認証が必要です。<br />
      もし認証用のメールを受け取っていない場合、
      <v-btn
        data-test="resendMailContentButton"
        color="primary"
        small
        :loading="loading"
        @click="resendMail"
      >
        認証メール再送信
      </v-btn>
      をクリックして、認証メールを受け取ってください。
    </v-card-text>

    <v-card-actions>
      <v-btn
        data-test="resendMailFooterButton"
        color="primary"
        :loading="loading"
        @click="resendMail"
      >
        <v-icon left>
          mdi-email-send-outline
        </v-icon>
        認証メール再送信
      </v-btn>
      <v-spacer />
      <v-btn data-test="logoutButton" @click="logout">
        <v-icon left>
          mdi-logout-variant
        </v-icon>
        Logout
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ResendVerifiedMailComponent",
  data() {
    return {
      resend: false,
      loading: false
    }
  },
  methods: {
    // 認証メール再送信
    async resendMail() {
      if (!this.loading) {
        this.loading = true
        await this.$api.users.resendMail().then(res => {
          if (res.status === 200) {
            this.resend = true
          } else {
            this.$snackbar.openSnackbar({
              text: "認証メールの再送信に失敗しました。",
              options: { color: "error" }
            })
          }
        })
        this.loading = false
      }
    },

    // ログアウト
    async logout() {
      await this.$api.auth.logout()

      this.$router.push("/")
    }
  }
}
</script>
