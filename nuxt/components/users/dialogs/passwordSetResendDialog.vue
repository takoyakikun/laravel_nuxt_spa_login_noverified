<template>
  <div>
    <MyDialog
      ref="dialog"
      v-model="dialog"
      title="パスワード設定メール再送信"
      color="primary"
    >
      <template #content>
        {{ userData.name }} ({{ userData.email }})
        のパスワード設定メールを再送信しますか？
      </template>

      <template #actionsLeft="{ color }">
        <v-btn
          data-test="submitButton"
          :color="color"
          :loading="loading"
          @click="submit"
        >
          <v-icon left>
            mdi-email
          </v-icon>
          再送信
        </v-btn>
        <v-spacer />
      </template>
    </MyDialog>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import MyDialog from "@/components/dialog/myDialog"

export default {
  components: {
    MyDialog
  },
  data() {
    return {
      dialog: false,
      loading: false,
      userData: {}
    }
  },
  methods: {
    ...mapActions("snackbar", ["openSnackbar"]),

    // ダイアログを開く
    openDialog(userData) {
      this.dialog = true
      this.userData = userData
    },
    // パスワード設定メールを再送信
    async submit() {
      if (!this.loading) {
        this.loading = true
        await this.$api.users.passwordSetResend(this.userData.id).then(res => {
          if (res.status === 200) {
            this.openSnackbar({
              text: "パスワード設定メールを再送信しました。",
              options: { color: "success" }
            })
            this.$refs.dialog.close()
          } else {
            this.openSnackbar({
              text: "パスワード設定メールの再送信に失敗しました。",
              options: { color: "error" }
            })
          }
        })
        this.loading = false
      }
    }
  }
}
</script>
