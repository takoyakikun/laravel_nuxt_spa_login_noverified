<template>
  <v-card>
    <validation-observer ref="passwordSetValidate" v-slot="{ invalid }">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>パスワード登録</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <PasswordSetForm v-model="formValue" @submit="passwordSet" />
      </v-card-text>

      <v-card-actions>
        <v-btn
          data-test="passwordSetButton"
          :disabled="invalid"
          :loading="loading"
          color="primary"
          @click="passwordSet"
        >
          <v-icon left>
            mdi-pencil-lock
          </v-icon>
          パスワードを登録
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </validation-observer>
  </v-card>
</template>

<script>
import PasswordSetForm from "@/components/passwordSet/passwordSetForm"

export default {
  components: {
    PasswordSetForm
  },
  data() {
    return {
      loading: false,
      formValue: {}
    }
  },
  methods: {
    // パスワード登録
    async passwordSet() {
      if (!this.loading) {
        this.loading = true
        await this.$refs.passwordSetValidate.validate().then(async result => {
          if (result) {
            this.formValue.token = this.$nuxt.$route.params.token
            await this.$api.users
              .passwordSet(this.formValue)
              .then(async res => {
                if (res.status === 200) {
                  await this.$api.auth.getUser()
                  this.$snackbar.openSnackbar({
                    text: "パスワードを登録しました。",
                    options: { color: "success" }
                  })
                  this.$router.push("/")
                } else {
                  this.$snackbar.openSnackbar({
                    text: "パスワードの登録に失敗しました。",
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
