<template>
  <div>
    <!-- 編集ダイアログ -->
    <ValidationObserver ref="validate" v-slot="{ invalid }">
      <MyDialog
        ref="dialog"
        v-model="dialog"
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
      formValue: {}
    }
  },
  computed: {
    ...mapGetters("auth", ["user"])
  },
  methods: {
    ...mapActions("snackbar", ["openSnackbar"]),
    ...mapActions("users", ["editData", "passwordChange"]),
    ...mapActions("auth", ["setUser"]),

    // ダイアログを開く
    openDialog() {
      this.dialog = true
      this.formValue = lodash.cloneDeep(this.user) // ディープコピー
    },
    // データを更新
    async submit() {
      if (!this.loading) {
        this.loading = true
        await this.$refs.validate.validate().then(async result => {
          if (result) {
            await this.editData({
              formValue: this.formValue
            }).then(res => {
              if (res.status === 200) {
                this.openSnackbar({
                  text: "ユーザーデータを更新しました。",
                  options: { color: "success" }
                })
                this.$refs.dialog.close()
                this.$refs.validate.reset()
                this.setUser()
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
