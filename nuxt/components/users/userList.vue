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
    <CreateDialog ref="createDialog" />

    <!-- 編集ダイアログ -->
    <EditDialog ref="editDialog" />

    <!-- 削除ダイアログ -->
    <DeleteDialog ref="deleteDialog" />

    <!-- パスワード設定メール再送信ダイアログ -->
    <PasswordSetResendDialog ref="passwordSetResendDialog" />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import CreateDialog from "@/components/users/dialogs/createDialog"
import EditDialog from "@/components/users/dialogs/editDialog"
import DeleteDialog from "@/components/users/dialogs/deleteDialog"
import PasswordSetResendDialog from "@/components/users/dialogs/passwordSetResendDialog"

export default {
  components: {
    CreateDialog,
    EditDialog,
    DeleteDialog,
    PasswordSetResendDialog
  },
  data() {
    return {
      search: {}
    }
  },
  computed: {
    ...mapGetters({
      config: "config/config",
      getConfigData: "config/getConfigData",
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
    }
  },
  methods: {
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
      this.$refs.createDialog.openDialog()
    },
    // 編集ダイアログを開く
    openEditDialog(item) {
      this.$refs.editDialog.openDialog(item)
    },
    // 削除ダイアログを開く
    openDeleteDialog(item) {
      this.$refs.deleteDialog.openDialog(item)
    },
    // パスワード設定メール再送信ダイアログを開く
    openPasswordSetResendDialog(item) {
      this.$refs.passwordSetResendDialog.openDialog(item)
    }
  }
}
</script>
