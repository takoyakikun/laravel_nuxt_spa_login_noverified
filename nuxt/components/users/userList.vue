<template>
  <v-container fluid>
    <v-row dense>
      <v-col>
        <v-btn
          data-test="createDialogButton"
          color="info"
          dark
          @click="openCreateDialog()"
        >
          <v-icon left>
            mdi-account-plus
          </v-icon>
          新規追加
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <!-- ユーザー一覧テーブル -->
        <v-data-table
          :headers="headers"
          :items="userList"
          disable-sort
          disable-pagination
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:top>
            <!-- 検索フォーム -->
            <v-row dense>
              <v-col>
                <v-text-field
                  v-model="search.name"
                  label="ユーザー名検索"
                  class="mx-4"
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="search.email"
                  label="メールアドレス検索"
                  class="mx-4"
                />
              </v-col>
              <v-col>
                <v-combobox
                  v-model="search.role"
                  :items="config.roleOptions"
                  label="アクセス権限検索"
                  multiple
                  chips
                  class="mx-4"
                />
              </v-col>
            </v-row>
          </template>

          <template #[`item.email`]="{ value, item }">
            <span>{{ value }}</span>
            <v-tooltip v-if="!item.password_set_flg" right color="primary">
              <template #activator="{ on }">
                <v-btn
                  data-test="passwordSetResendDialog"
                  icon
                  color="primary"
                  v-on="on"
                  @click="openPasswordSetResendDialog(item)"
                >
                  <v-icon>mdi-email</v-icon>
                </v-btn>
              </template>
              <span>パスワード設定メール再送信</span>
            </v-tooltip>
          </template>
          <template #[`item.role`]="{ value }">
            {{ getConfigData("roleOptions", value) }}
          </template>
          <template #[`item.action`]="{ item }">
            <v-tooltip left color="success">
              <template #activator="{ on }">
                <v-btn
                  data-test="editDialogButton"
                  icon
                  color="success"
                  :disabled="!item.modify_flg"
                  v-on="on"
                  @click="openEditDialog(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>編集</span>
            </v-tooltip>
            <v-tooltip right color="error">
              <template #activator="{ on }">
                <v-btn
                  data-test="deleteDialogButton"
                  icon
                  color="error"
                  :disabled="!item.delete_flg"
                  v-on="on"
                  @click="openDeleteDialog(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>削除</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- 新規追加ダイアログ -->
    <validation-observer ref="createForm" v-slot="{ invalid }">
      <MyDialog
        ref="createDialog"
        v-model="createDialog"
        title="新規ユーザー追加"
        color="info"
        :options="{ persistent: true }"
      >
        <template #content>
          <UserForm
            v-model="createFormValue"
            form-type="usersCreate"
            @submit="createSubmit"
          />
        </template>

        <template #actionsLeft="{ color }">
          <v-btn
            data-test="createSubmitButton"
            :disabled="invalid"
            :color="color"
            :loading="createLoading"
            @click="createSubmit"
          >
            <v-icon left>
              mdi-account-plus
            </v-icon>
            追加
          </v-btn>
          <v-spacer />
        </template>
      </MyDialog>
    </validation-observer>

    <!-- 編集ダイアログ -->
    <validation-observer ref="editForm" v-slot="{ invalid }">
      <MyDialog
        ref="editDialog"
        v-model="editDialog"
        title="ユーザー編集"
        color="success"
        :options="{ persistent: true }"
      >
        <template #content>
          <UserForm
            v-model="editFormValue"
            form-type="edit"
            :myuser.sync="myuser"
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

    <!-- 削除ダイアログ -->
    <MyDialog
      ref="deleteDialog"
      v-model="deleteDialog"
      title="ユーザー削除"
      color="error"
    >
      <template #content>
        ユーザーを削除しますか？
      </template>

      <template #actionsLeft="{ color }">
        <v-btn
          data-test="deleteSubmitButton"
          :color="color"
          :loading="deleteLoading"
          @click="deleteSubmit"
        >
          <v-icon left>
            mdi-delete
          </v-icon>
          削除
        </v-btn>
        <v-spacer />
      </template>
    </MyDialog>

    <!-- パスワード設定メール再送信ダイアログ -->
    <MyDialog
      ref="passwordSetResendDialog"
      v-model="passwordSetResendDialog"
      title="パスワード設定メール再送信"
      color="primary"
    >
      <template #content>
        {{ passwordSetResendItem.name }} ({{ passwordSetResendItem.email }})
        のパスワード設定メールを再送信しますか？
      </template>

      <template #actionsLeft="{ color }">
        <v-btn
          data-test="passwordSetResendSubmitButton"
          :color="color"
          :loading="passwordSetResendLoading"
          @click="passwordSetResendSubmit"
        >
          <v-icon left>
            mdi-email
          </v-icon>
          再送信
        </v-btn>
        <v-spacer />
      </template>
    </MyDialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import MyDialog from "@/components/dialog/myDialog"
import UserForm from "@/components/users/forms/userForm"

export default {
  components: {
    MyDialog,
    UserForm
  },
  data() {
    return {
      search: {},
      createDialog: false,
      createLoading: false,
      createFormValue: {},
      editDialog: false,
      editLoading: false,
      editId: null,
      editFormValue: {},
      deleteDialog: false,
      deleteLoading: false,
      deleteId: null,
      passwordSetResendDialog: false,
      passwordSetResendLoading: false,
      passwordSetResendItem: {}
    }
  },
  computed: {
    ...mapGetters({
      config: "config/config",
      getConfigData: "config/getConfigData",
      user: "auth/user",
      userExists: "auth/userExists",
      permission: "auth/permission",
      userList: "users/list"
    }),

    headers() {
      return [
        {
          text: "ユーザー名",
          value: "name",
          filter: value => {
            return this.searchName(value)
          }
        },
        {
          text: "メールアドレス",
          value: "email",
          filter: value => {
            return this.searchEmail(value)
          }
        },
        {
          text: "アクセス権限",
          value: "role",
          filter: value => {
            return this.searchRole(value)
          }
        },
        {
          text: "編集/削除",
          value: "action"
        }
      ]
    },

    // 自ユーザーかどうか
    myuser() {
      return this.user.id === this.editId
    }
  },
  methods: {
    ...mapActions("users", [
      "createData",
      "editData",
      "deleteData",
      "passwordSetResend"
    ]),
    ...mapActions("snackbar", ["openSnackbar"]),

    // ユーザー名検索
    searchName(value) {
      if (!this.search.name) return true
      return (
        value != null &&
        typeof value === "string" &&
        value.toString().indexOf(this.search.name) !== -1
      )
    },

    // メールアドレス検索
    searchEmail(value) {
      if (!this.search.email) return true
      return (
        value != null &&
        typeof value === "string" &&
        value.toString().indexOf(this.search.email) !== -1
      )
    },

    // アクセス権限検索
    searchRole(value) {
      if (!this.search.role || Object.keys(this.search.role).length === 0) {
        return true
      }
      return this.search.role.some(item => item.value === value)
    },

    // 新規追加ダイアログを開く
    openCreateDialog() {
      this.createDialog = true
    },
    // データを追加
    async createSubmit() {
      if (!this.createLoading) {
        this.createLoading = true
        await this.$refs.createForm.validate().then(async result => {
          if (result) {
            await this.createData(this.createFormValue).then(res => {
              if (res.status === 200) {
                this.openSnackbar({
                  text: "ユーザーデータを追加しました。",
                  options: { color: "success" }
                })
                this.$refs.createDialog.close()
                this.createFormValue = {}
                this.$refs.createForm.reset()
              } else {
                this.openSnackbar({
                  text: "ユーザーデータの追加に失敗しました。",
                  options: { color: "error" }
                })
              }
            })
          }
        })
        this.createLoading = false
      }
    },
    // 編集ダイアログを開く
    openEditDialog(item) {
      this.editDialog = true
      this.editId = item.id
      this.editFormValue = JSON.parse(JSON.stringify(item)) // ディープコピー
    },
    // データを更新
    async editSubmit() {
      if (!this.editLoading) {
        this.editLoading = true
        await this.$refs.editForm.validate().then(async result => {
          if (result) {
            const option = {
              formValue: this.editFormValue
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
                this.$refs.editDialog.close()
                this.$refs.editForm.reset()
                // 自ユーザーはログインデータを更新
                if (this.myuser) {
                  this.$store.dispatch("auth/setUser")
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
        this.editLoading = false
      }
    },
    // 削除ダイアログを開く
    openDeleteDialog(item) {
      this.deleteDialog = true
      this.deleteId = item.id
    },
    // データを削除
    async deleteSubmit() {
      if (!this.deleteLoading) {
        this.deleteLoading = true
        await this.deleteData(this.deleteId).then(res => {
          if (res.status === 200) {
            this.openSnackbar({
              text: "ユーザーデータを削除しました。",
              options: { color: "success" }
            })
            this.$refs.deleteDialog.close()
          } else {
            this.openSnackbar({
              text: "ユーザーデータの削除に失敗しました。",
              options: { color: "error" }
            })
          }
        })
        this.deleteLoading = false
      }
    },
    // 削除ダイアログを開く
    openPasswordSetResendDialog(item) {
      this.passwordSetResendDialog = true
      this.passwordSetResendItem = item
    },
    // パスワード設定メールを再送信
    async passwordSetResendSubmit() {
      if (!this.passwordSetResendLoading) {
        this.passwordSetResendLoading = true
        await this.passwordSetResend(this.passwordSetResendItem.id).then(
          res => {
            if (res.status === 200) {
              this.openSnackbar({
                text: "パスワード設定メールを再送信しました。",
                options: { color: "success" }
              })
              this.$refs.passwordSetResendDialog.close()
            } else {
              this.openSnackbar({
                text: "パスワード設定メールの再送信に失敗しました。",
                options: { color: "error" }
              })
            }
          }
        )
        this.passwordSetResendLoading = false
      }
    }
  }
}
</script>
