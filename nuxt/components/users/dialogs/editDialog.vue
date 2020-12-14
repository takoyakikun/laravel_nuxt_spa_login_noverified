<template>
  <div>
    <ValidationObserver ref="validate" v-slot="{ invalid }">
      <MyDialog
        ref="dialog"
        v-model="dialog"
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

        <template #actionsLeft="{ color }">
          <v-btn
            data-test="submitButton"
            :disabled="invalid"
            :color="color"
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
import { mapGetters, mapActions } from "vuex"
import lodash from "lodash"
import MyDialog from "@/components/dialog/myDialog"
import UserForm from "@/components/users/forms/userForm"

export default {
  components: {
    MyDialog,
    UserForm
  },
  data() {
    return {
      dialog: false,
      loading: false,
      formValue: {},
      editId: null
    }
  },
  computed: {
    ...mapGetters("auth", ["user"]),

    // 自ユーザーかどうか
    myuser() {
      return this.user.id === this.editId
    }
  },
  methods: {
    ...mapActions("snackbar", ["openSnackbar"]),
    ...mapActions("users", ["editData"]),
    ...mapActions("auth", ["setUser"]),

    // ダイアログを開く
    openDialog(userData) {
      this.dialog = true
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

            await this.editData(option).then(res => {
              if (res.status === 200) {
                this.openSnackbar({
                  text: "ユーザーデータを更新しました。",
                  options: { color: "success" }
                })
                this.$refs.dialog.close()
                this.$refs.validate.reset()
                // 自ユーザーはログインデータを更新
                if (this.myuser) {
                  this.setUser()
                }
              } else {
                this.openSnackbar({
                  text: "ユーザーデータの更新に失敗しました。",
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
