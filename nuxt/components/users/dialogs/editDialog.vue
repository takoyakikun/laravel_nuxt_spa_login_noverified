<template>
  <div>
    <ValidationObserver ref="validate" v-slot="{ invalid }">
      <MyDialog
        ref="dialog"
        title="ユーザー編集"
        color="success"
        :options="{ persistent: true }"
      >
        <template #content>
          <UserForm
            v-model="formValue"
            form-type="edit"
            :myuser.sync="myuser"
            @submit="submit"
          />
        </template>

        <template #actionsLeft="{ state }">
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
          <v-spacer />
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
  name: 'UserEditDialogComponent',
  components: {
    MyDialog,
    UserForm
  },
  data() {
    return {
      loading: false,
      formValue: {},
      editId: null
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),

    // 自ユーザーかどうか
    myuser() {
      return this.user.id === this.editId
    }
  },
  methods: {
    // ダイアログを開く
    openDialog(userData) {
      this.$refs.dialog.openDialog()
      this.formValue = lodash.cloneDeep(userData) // ディープコピー
      this.editId = userData.id
    },
    // データを更新
    async submit() {
      if (!this.loading) {
        this.loading = true
        await this.$refs.validate.validate().then(async result => {
          if (result) {
            const option = {
              formValue: this.formValue
            }
            // 自ユーザー以外はidを設定
            if (!this.myuser) {
              option.id = this.editId
            }

            await this.$api.users.editData(option).then(res => {
              if (res.status === 200) {
                this.$snackbar.openSnackbar({
                  text: 'ユーザーデータを更新しました。',
                  options: { color: 'success' }
                })
                this.$refs.dialog.closeDialog()
                this.$refs.validate.reset()
                // 自ユーザーはログインデータを更新
                if (this.myuser) {
                  this.$api.auth.getUser()
                }
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
