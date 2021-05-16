<template>
  <div>
    <!-- 編集ダイアログ -->
    <ValidationObserver ref="validate" v-slot="{ invalid }">
      <MyDialog
        ref="dialog"
        title="ユーザー編集"
        color="primary"
        :options="{ persistent: true }"
      >
        <template #content>
          <UserForm
            v-model="formValue"
            form-type="edit"
            myuser
            @submit="submit"
          />
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
              mdi-account-edit
            </v-icon>
            更新
          </v-btn>
        </template>
      </MyDialog>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import lodash from 'lodash'
import MyDialog from '~/components/dialog/myDialog'
import UserForm from '~/components/users/forms/userForm'

export default {
  name: 'DefaultLayoutEditDialogComponent',
  components: {
    MyDialog,
    UserForm
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
      this.formValue = lodash.cloneDeep(this.user) // ディープコピー
    },
    // データを更新
    async submit() {
      if (!this.loading) {
        this.loading = true
        await this.$refs.validate.validate().then(async result => {
          if (result) {
            await this.$api.users
              .editData({
                formValue: this.formValue
              })
              .then(res => {
                if (res.status === 200) {
                  this.$snackbar.openSnackbar({
                    text: 'ユーザーデータを更新しました。',
                    options: { color: 'success' }
                  })
                  this.$refs.dialog.closeDialog()
                  this.$refs.validate.reset()
                  this.$api.auth.getUser()
                } else {
                  this.$snackbar.openSnackbar({
                    text: 'ユーザーデータの更新に失敗しました。',
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
