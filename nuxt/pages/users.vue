<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col>
        <!-- ログインユーザー一覧 -->
        <UserList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserList from '~/components/users/userList'

export default {
  name: 'UserPage',
  middleware: 'admin',
  layout: 'default',
  components: {
    UserList
  },
  created() {
    this.$api.users.getList()
    this.$api.users.getRoleOptions()
  },
  head() {
    return {
      title: 'ログインユーザー管理'
    }
  }
}
</script>
