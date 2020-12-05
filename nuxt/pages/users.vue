<template>
  <v-row align="center" justify="center">
    <v-col>
      <!-- ログインユーザー一覧 -->
      <UserList />
    </v-col>
  </v-row>
</template>

<script>
import UserList from "~/components/users/userList"

export default {
  middleware: "admin",
  layout: "default",
  components: {
    UserList
  },
  created() {
    this.$store.dispatch("users/setList")
    this.$store.dispatch("users/setRoleOptions")
  }
}
</script>
