<template>
  <div>
    <!-- パスワード変更ダイアログ -->
    <ValidationObserver ref="validate" v-slot="{ invalid }">
      <MyDialog
        ref="dialog"
        title="パスワード変更"
        color="primary"
        :options="{ persistent: true }"
      >
        <template #content>
          <PasswordChangeForm v-model="formValue" @submit="submit" />
        </template>

        <template #actionsRight="{ state }">
          <v-btn
            data-test="submitButton"
            :disabled="invalid"
            :color="state.color"
            :loading="loading"
            @click="submit"
          >
            <v-icon left>
              mdi-pencil-lock
            </v-icon>
            変更
          </v-btn>
        </template>
      </MyDialog>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MyDialog from '~/components/dialog/myDialog'
import PasswordChangeForm from '~/components/users/forms/passwordChangeForm'

export default {
  name: 'DefaultLayoutPasswordChangeComponent',
  components: {
    MyDialog,
    PasswordChangeForm
  },
  data() {
    return {
      loading: false,
      formValue: {}
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  methods: {
    // ダイアログを開く
    openDialog() {
      this.$refs.dialog.openDialog()
      this.formValue = {}
    },
    // データを更新
    async submit() {
      if (!this.loading) {
        this.loading = true
        await this.$refs.validate.validate().then(async result => {
          if (result) {
            await this.$api.users.passwordChange(this.formValue).then(res => {
              if (res.status === 200) {
                this.$snackbar.openSnackbar({
                  text: 'パスワードを変更しました。',
                  options: { color: 'success' }
                })
                this.$refs.dialog.closeDialog()
                this.$refs.validate.reset()
              } else {
                let text = 'パスワードの変更に失敗しました。'
                if (res.data.error_message) {
                  text = res.data.error_message
                }
                this.$snackbar.openSnackbar({
                  text: text,
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
