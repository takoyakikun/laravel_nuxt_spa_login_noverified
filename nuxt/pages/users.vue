<template>
  <v-row align="center" justify="center">
    <v-col>
      <!-- ログインユーザー一覧 -->
      <UserList />
    </v-col>
  </v-row>
</template>

<script>
import UserList from "@/components/users/userList"

export default {
  middleware: "admin",
  layout: "default",
  components: {
    UserList
  },
  created() {
    this.$api.users.getList()
    this.$api.users.getRoleOptions()
  }
}
</script>
