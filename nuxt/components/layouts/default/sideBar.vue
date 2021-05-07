<template>
  <v-navigation-drawer v-model="value" app>
    <v-list dense>
      <!-- Topページ -->
      <v-list-item data-test="topItemLink" link to="/">
        <v-list-item-action>
          <v-icon>mdi-home</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Top</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- 認証済ページ -->
      <v-list-item v-if="userExists" data-test="authItemLink" link to="auth">
        <v-list-item-action>
          <v-icon>mdi-lock</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Auth</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- ユーザー管理 -->
      <v-list-item
        v-if="permission('admin-higher')"
        data-test="usersItemLink"
        link
        to="users"
      >
        <v-list-item-action>
          <v-icon>mdi-account-group</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DefaultLayoutSideBarComponent',
  props: {
    value: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user',
      'userExists',
      'permission',
      'permissionExists'
    ])
  }
}
</script>
