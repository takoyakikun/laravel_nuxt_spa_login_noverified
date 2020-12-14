<template>
  <div>
    <!-- パスワード変更ダイアログ -->
    <ValidationObserver ref="validate" v-slot="{ invalid }">
      <MyDialog
        ref="dialog"
        v-model="dialog"
        title="パスワード変更"
        color="primary"
        :options="{ persistent: true }"
      >
        <template #content>
          <PasswordChangeForm v-model="formValue" @submit="submit" />
        </template>

        <template #actionsLeft="{ color }">
          <v-btn
            data-test="submitButton"
            :disabled="invalid"
            :color="color"
            :loading="loading"
            @click="submit"
          >
            <v-icon left>
              mdi-pencil-lock
            </v-icon>
            変更
          </v-btn>
          <v-spacer />
        </template>
      </MyDialog>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import MyDialog from "@/components/dialog/myDialog"
import PasswordChangeForm from "@/components/users/forms/passwordChangeForm"

export default {
  components: {
    MyDialog,
    PasswordChangeForm
  },
  data() {
    return {
      dialog: false,
      loading: false,
      formValue: {}
    }
  },
  computed: {
    ...mapGetters("auth", ["user"])
  },
  methods: {
    ...mapActions("snackbar", ["openSnackbar"]),
    ...mapActions("users", ["passwordChange"]),

    // ダイアログを開く
    openDialog() {
      this.dialog = true
      this.formValue = {}
    },
    // データを更新
    async submit() {
      if (!this.loading) {
        this.loading = true
        await this.$refs.validate.validate().then(async result => {
          if (result) {
            await this.passwordChange(this.formValue).then(res => {
              if (res.status === 200) {
                this.openSnackbar({
                  text: "パスワードを変更しました。",
                  options: { color: "success" }
                })
                this.$refs.dialog.close()
                this.$refs.validate.reset()
              } else {
                let text = "パスワードの変更に失敗しました。"
                if (res.data.error_message) {
                  text = res.data.error_message
                }
                this.openSnackbar({
                  text: text,
                  options: { color: "error" }
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
