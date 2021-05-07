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
    <EditDialog ref="editDialog" />

    <!-- パスワード変更ダイアログ -->
    <PasswordChangeDialog ref="passwordChangeDialog" />
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditDialog from '~/components/layouts/default/dialogs/editDialog'
import PasswordChangeDialog from '~/components/layouts/default/dialogs/passwordChangeDialog'

export default {
  name: 'DefaultLayoutHeaderComponent',
  components: {
    EditDialog,
    PasswordChangeDialog
  },
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataDrawer: false
    }
  },
  computed: {
    ...mapGetters('auth', ['user', 'userExists'])
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
    // サイドバーの表示切り替え
    toggleDrawer() {
      this.dataDrawer = !this.dataDrawer
      this.$emit('drawer', this.dataDrawer)
    },

    // ログアウト
    async logout() {
      await this.$api.auth.logout()

      this.$router.push('/')
    },

    // 編集ダイアログを開く
    openEditDialog() {
      this.$refs.editDialog.openDialog()
    },

    // パスワード変更ダイアログを開く
    openPasswordChangeDialog() {
      this.$refs.passwordChangeDialog.openDialog()
    }
  }
}
</script>
