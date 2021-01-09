<template>
  <v-card>
    <validation-observer ref="passwordResetValidate" v-slot="{ invalid }">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>パスワードリセット</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <PasswordResetForm v-model="formValue" @submit="passwordReset" />
      </v-card-text>

      <v-card-actions>
        <v-btn
          data-test="passwordResetButton"
          :disabled="invalid"
          :loading="loading"
          color="primary"
          @click="passwordReset"
        >
          <v-icon left>
            mdi-pencil-lock
          </v-icon>
          パスワードリセット
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </validation-observer>
  </v-card>
</template>

<script>
import PasswordResetForm from "@/components/passwordReset/passwordResetForm"

export default {
  components: {
    PasswordResetForm
  },
  data() {
    return {
      loading: false,
      formValue: {}
    }
  },
  methods: {
    // パスワードリセット
    async passwordReset() {
      if (!this.loading) {
        this.loading = true
        await this.$refs.passwordResetValidate.validate().then(async result => {
          if (result) {
            this.formValue.token = this.$nuxt.$route.params.token
            await this.$api.users
              .passwordReset(this.formValue)
              .then(async res => {
                if (res.status === 200) {
                  await this.$api.auth.getUser()
                  this.$snackbar.openSnackbar({
                    text: "パスワードリセットしました。",
                    options: { color: "success" }
                  })
                  this.$router.push("/")
                } else {
                  this.$snackbar.openSnackbar({
                    text: "パスワードリセットに失敗しました。",
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
