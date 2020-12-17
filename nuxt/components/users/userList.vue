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
          v-model="selected"
          :headers="headers"
          :items="userList"
          disable-sort
          disable-pagination
          hide-default-footer
          show-select
          class="elevation-1"
        >
          <template #top>
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

          <template #[`header.data-table-select`]="{ props, on }">
            <v-simple-checkbox v-bind="props" color="primary" v-on="on" />
          </template>

          <template #[`item.data-table-select`]="{ isSelected, select }">
            <v-simple-checkbox
              :value="isSelected"
              color="primary"
              @input="select(!isSelected)"
            />
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

        <v-app-bar
          v-model="showSelectedBar"
          fixed
          bottom
          color="light-blue lighten-5"
        >
          <v-container>
            <v-row justify="center">
              <v-col cols="auto">
                <v-toolbar-title>
                  選択したユーザーを
                </v-toolbar-title>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  data-test="deleteMultiDialogButton"
                  color="error"
                  @click="openDeleteMultiDialog"
                >
                  <v-icon>mdi-delete</v-icon>
                  <span>削除</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-app-bar>
      </v-col>
    </v-row>

    <!-- 新規追加ダイアログ -->
    <CreateDialog ref="createDialog" />

    <!-- 編集ダイアログ -->
    <EditDialog ref="editDialog" />

    <!-- 削除ダイアログ -->
    <DeleteDialog ref="deleteDialog" />

    <!-- 複数削除ダイアログ -->
    <DeleteMultiDialog
      ref="deleteMultiDialog"
      :delete-users.sync="deleteUsers"
    />

    <!-- パスワード設定メール再送信ダイアログ -->
    <PasswordSetResendDialog ref="passwordSetResendDialog" />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import CreateDialog from "@/components/users/dialogs/createDialog"
import EditDialog from "@/components/users/dialogs/editDialog"
import DeleteDialog from "@/components/users/dialogs/deleteDialog"
import DeleteMultiDialog from "@/components/users/dialogs/deleteMultiDialog"
import PasswordSetResendDialog from "@/components/users/dialogs/passwordSetResendDialog"

export default {
  components: {
    CreateDialog,
    EditDialog,
    DeleteDialog,
    DeleteMultiDialog,
    PasswordSetResendDialog
  },
  data() {
    return {
      search: {},
      selected: []
    }
  },
  computed: {
    ...mapGetters({
      config: "config/config",
      getConfigData: "config/getConfigData",
      userListStore: "users/list"
    }),

    // テーブルのヘッダー設定
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

    // ユーザーデータをストアから取得
    userList() {
      return this.userListStore
    },

    // 選択したユーザーのアクションメニューバー表示
    showSelectedBar() {
      return this.showDeleteMultiButton
    },

    // 削除するユーザーデータを取得
    deleteUsers() {
      return this.selected.filter(item => item.delete_flg === 1)
    },

    // 複数ユーザー削除ボタン表示
    showDeleteMultiButton() {
      return this.deleteUsers.length > 0
    }
  },
  watch: {
    // ユーザーデータが更新されたら選択を初期化する
    userList() {
      this.selected = []
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
    // 複数削除ダイアログを開く
    openDeleteMultiDialog() {
      this.$refs.deleteMultiDialog.openDialog()
    },
    // パスワード設定メール再送信ダイアログを開く
    openPasswordSetResendDialog(item) {
      this.$refs.passwordSetResendDialog.openDialog(item)
    }
  }
}
</script>
