<template>
  <v-app-bar app color="indigo" dark>
    <!-- サイドバー開閉 -->
    <v-app-bar-nav-icon @click.stop="toggleDrawer" />

    <v-toolbar-title>Application</v-toolbar-title>
    <v-spacer />

    <!-- ログイン済ユーザーメニュー -->
    <template v-if="userExists">
      <!-- マイユーザー管理 -->
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            data-test="myuserMenuButton"
            class="mx-1"
            outlined
            rounded
            v-on="on"
          >
            <v-icon left>
              mdi-account-circle
            </v-icon>
            {{ user.name }}
            <v-icon right>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <!-- マイユーザー編集 -->
          <v-list-item data-test="editDialogItem" @click="openEditDialog">
            <v-list-item-title>
              <v-icon left>
                mdi-account-edit
              </v-icon>
              編集
            </v-list-item-title>
          </v-list-item>

          <!-- パスワード変更 -->
          <v-list-item
            data-test="passwordChangeDialogItem"
            @click="openPasswordChangeDialog"
          >
            <v-list-item-title>
              <v-icon left>
                mdi-lock
              </v-icon>
              パスワード変更
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- ログアウト -->
      <v-btn data-test="logoutButton" class="mx-1" outlined @click="logout">
        <v-icon left>
          mdi-logout-variant
        </v-icon>
        Logout
      </v-btn>
    </template>

    <!-- ログアウトメニュー -->
    <template v-if="!userExists">
      <!-- 新規ユーザー作成 -->
      <v-btn data-test="registerButton" class="mx-1" outlined to="register">
        <v-icon left>
          mdi-account-plus
        </v-icon>
        新規登録
      </v-btn>

      <!-- ログイン -->
      <v-btn data-test="loginButton" class="mx-1" outlined to="login">
        <v-icon left>
          mdi-login-variant
        </v-icon>
        Login
      </v-btn>
    </template>

    <!-- 編集ダイアログ -->
    <validation-observer ref="editFormValidate" v-slot="{ invalid }">
      <MyDialog
        ref="editDialog"
        v-model="editDialog"
        title="ユーザー編集"
        color="primary"
        :options="{ persistent: true }"
      >
        <template #content>
          <UserForm
            v-model="editFormValue"
            form-type="edit"
            myuser
            @submit="editSubmit"
          />
        </template>

        <template #actionsLeft="{ color }">
          <v-btn
            data-test="editSubmitButton"
            :disabled="invalid"
            :color="color"
            :loading="editLoading"
            @click="editSubmit"
          >
            <v-icon left>
              mdi-account-edit
            </v-icon>
            更新
          </v-btn>
          <v-spacer />
        </template>
      </MyDialog>
    </validation-observer>

    <!-- パスワード変更ダイアログ -->
    <validation-observer ref="passwordChangeFormValidate" v-slot="{ invalid }">
      <MyDialog
        ref="passwordChangeDialog"
        v-model="passwordChangeDialog"
        title="パスワード変更"
        color="primary"
        :options="{ persistent: true }"
      >
        <template #content>
          <PasswordChangeForm
            v-model="passwordChangeFormValue"
            @submit="passwordChangeSubmit"
          />
        </template>

        <template #actionsLeft="{ color }">
          <v-btn
            data-test="passwordChangeSubmitButton"
            :disabled="invalid"
            :color="color"
            :loading="passwordChangeLoading"
            @click="passwordChangeSubmit"
          >
            <v-icon left>
              mdi-pencil-lock
            </v-icon>
            変更
          </v-btn>
          <v-spacer />
        </template>
      </MyDialog>
    </validation-observer>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

import MyDialog from "@/components/dialog/myDialog"
import UserForm from "@/components/users/userForm"
import PasswordChangeForm from "@/components/users/passwordChangeForm"

export default {
  components: {
    MyDialog,
    UserForm,
    PasswordChangeForm
  },
  props: {
    drawer: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      dataDrawer: false,
      editDialog: false,
      editLoading: false,
      editFormValue: {},
      passwordChangeDialog: false,
      passwordChangeLoading: false,
      passwordChangeFormValue: {}
    }
  },
  computed: {
    ...mapGetters("auth", [
      "user",
      "userExists",
      "permission",
      "permissionExists"
    ])
  },
  watch: {
    drawer: {
      immediate: true,
      handler(value) {
        this.dataDrawer = value
      }
    }
  },
  methods: {
    ...mapActions("snackbar", ["openSnackbar"]),
    ...mapActions("users", ["editData", "passwordChange"]),

    // サイドバーの表示切り替え
    toggleDrawer() {
      this.dataDrawer = !this.dataDrawer
      this.$emit("drawer", this.dataDrawer)
    },

    // ログアウト
    async logout() {
      await this.$store.dispatch("auth/logout")

      this.$router.push("/")
    },

    // 編集ダイアログを開く
    openEditDialog() {
      this.editDialog = true
      this.editFormValue = JSON.parse(JSON.stringify(this.user)) // ディープコピー
    },
    // データを更新
    async editSubmit() {
      if (!this.editLoading) {
        this.editLoading = true
        await this.$refs.editFormValidate.validate().then(async result => {
          if (result) {
            await this.editData({
              formValue: this.editFormValue
            }).then(res => {
              if (res.status === 200) {
                this.openSnackbar({
                  text: "ユーザーデータを更新しました。",
                  options: { color: "success" }
                })
                this.$refs.editDialog.close()
                this.$refs.editFormValidate.reset()
                this.$store.dispatch("auth/setUser")
              } else {
                this.openSnackbar({
                  text: "ユーザーデータの更新に失敗しました。",
                  options: { color: "error" }
                })
              }
            })
          }
        })
        this.editLoading = false
      }
    },

    // パスワード変更ダイアログを開く
    openPasswordChangeDialog() {
      this.passwordChangeDialog = true
      this.passwordChangeFormValue = {}
    },
    // パスワードを変更
    async passwordChangeSubmit() {
      if (!this.passwordChangeLoading) {
        this.passwordChangeLoading = true
        await this.$refs.passwordChangeFormValidate
          .validate()
          .then(async result => {
            if (result) {
              await this.passwordChange(this.passwordChangeFormValue).then(
                res => {
                  if (res.status === 200) {
                    this.openSnackbar({
                      text: "パスワードを変更しました。",
                      options: { color: "success" }
                    })
                    this.$refs.passwordChangeDialog.close()
                    this.$refs.passwordChangeFormValidate.reset()
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
                }
              )
            }
          })
        this.passwordChangeLoading = false
      }
    }
  }
}
</script>
