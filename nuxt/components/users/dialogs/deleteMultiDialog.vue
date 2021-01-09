<template>
  <div>
    <MyDialog ref="dialog" v-model="dialog" title="ユーザー削除" color="error">
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

      <template #actionsLeft="{ color }">
        <v-btn
          data-test="submitButton"
          :color="color"
          :loading="loading"
          @click="submit"
        >
          <v-icon left>
            mdi-delete
          </v-icon>
          削除
        </v-btn>
        <v-spacer />
      </template>
    </MyDialog>
  </div>
</template>

<script>
import MyDialog from "@/components/dialog/myDialog"

export default {
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
      dialog: false,
      loading: false
    }
  },
  methods: {
    // ダイアログを開く
    openDialog() {
      // 削除するユーザーデータがある場合のみ開く
      if (this.deleteUsers.length > 0) {
        this.dialog = true
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
              text: "ユーザーデータを削除しました。",
              options: { color: "success" }
            })
            this.$refs.dialog.close()
          } else {
            this.$snackbar.openSnackbar({
              text: "ユーザーデータの削除に失敗しました。",
              options: { color: "error" }
            })
          }
        })
        this.loading = false
      }
    }
  }
}
</script>
