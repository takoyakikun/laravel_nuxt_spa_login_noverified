<template>
  <div>
    <MyDialog ref="dialog" title="ユーザー削除" color="error">
      <template #content>
        <v-list dense>
          <v-list-item>
            <v-list-item-title>
              下記のユーザーを削除しますか？
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-for="user in deleteUsers" :key="user.id">
            <v-list-item-content>
              {{ user.name }} ({{ user.email }})
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>

      <template #actionsRight="{ state }">
        <v-btn
          data-test="submitButton"
          :color="state.color"
          :loading="loading"
          @click="submit"
        >
          <v-icon left>
            mdi-delete
          </v-icon>
          削除
        </v-btn>
      </template>
    </MyDialog>
  </div>
</template>

<script>
import MyDialog from '~/components/dialog/myDialog'

export default {
  name: 'UserDeleteMultiDialogComponent',
  components: {
    MyDialog
  },
  props: {
    deleteUsers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    // ダイアログを開く
    openDialog() {
      // 削除するユーザーデータがある場合のみ開く
      if (this.deleteUsers.length > 0) {
        this.$refs.dialog.openDialog()
      }
    },
    // データを削除
    async submit() {
      if (!this.loading) {
        this.loading = true
        const deleteUsersId = this.deleteUsers.map(item => item.id)
        await this.$api.users.deleteMultiData(deleteUsersId).then(res => {
          if (res.status === 200) {
            this.$snackbar.openSnackbar({
              text: 'ユーザーデータを削除しました。',
              options: { color: 'success' }
            })
            this.$refs.dialog.closeDialog()
          } else {
            this.$snackbar.openSnackbar({
              text: 'ユーザーデータの削除に失敗しました。',
              options: { color: 'error' }
            })
          }
        })
        this.loading = false
      }
    }
  }
}
</script>
