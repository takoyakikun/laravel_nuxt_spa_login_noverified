<template>
  <div>
    <MyDialog ref="dialog" title="ユーザー削除" color="error">
      <template #content>
        {{ userData.name }} ({{ userData.email }}) を削除しますか？
      </template>

      <template #actionsLeft="{ state }">
        <v-btn
          data-test="submitButton"
          :color="state.color"
          :loading="loading"
          @click="submit"
        >
          <v-icon left>
            mdi-delete
          </v-icon>
          削除
        </v-btn>
        <v-spacer />
      </template>
    </MyDialog>
  </div>
</template>

<script>
import MyDialog from "~/components/dialog/myDialog"

export default {
  name: "UserDeleteDialogComponent",
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
    // データを削除
    async submit() {
      if (!this.loading) {
        this.loading = true
        await this.$api.users.deleteData(this.userData.id).then(res => {
          if (res.status === 200) {
            this.$snackbar.openSnackbar({
              text: "ユーザーデータを削除しました。",
              options: { color: "success" }
            })
            this.$refs.dialog.closeDialog()
          } else {
            this.$snackbar.openSnackbar({
              text: "ユーザーデータの削除に失敗しました。",
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
