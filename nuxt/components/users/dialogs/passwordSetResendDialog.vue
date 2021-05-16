<template>
  <div>
    <MyDialog ref="dialog" title="パスワード設定メール再送信" color="primary">
      <template #content>
        {{ userData.name }} ({{ userData.email }})
        のパスワード設定メールを再送信しますか？
      </template>

      <template #actionsRight="{ state }">
        <v-btn
          data-test="submitButton"
          :color="state.color"
          :loading="loading"
          @click="submit"
        >
          <v-icon left>
            mdi-email
          </v-icon>
          再送信
        </v-btn>
      </template>
    </MyDialog>
  </div>
</template>

<script>
import MyDialog from '~/components/dialog/myDialog'

export default {
  name: 'UserPasswordSetResendDialogComponent',
  components: {
    MyDialog
  },
  data() {
    return {
      loading: false,
      userData: {}
    }
  },
  methods: {
    // ダイアログを開く
    openDialog(userData) {
      this.$refs.dialog.openDialog()
      this.userData = userData
    },
    // パスワード設定メールを再送信
    async submit() {
      if (!this.loading) {
        this.loading = true
        await this.$api.users.passwordSetResend(this.userData.id).then(res => {
          if (res.status === 200) {
            this.$snackbar.openSnackbar({
              text: 'パスワード設定メールを再送信しました。',
              options: { color: 'success' }
            })
            this.$refs.dialog.closeDialog()
          } else {
            this.$snackbar.openSnackbar({
              text: 'パスワード設定メールの再送信に失敗しました。',
              options: { color: 'error' }
            })
          }
        })
        this.loading = false
      }
    }
  }
}
</script>
