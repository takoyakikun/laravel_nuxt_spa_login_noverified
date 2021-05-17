<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col v-if="userExists" class="text-center">
        {{ user.name }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AuthPage',
  middleware: 'auth',
  layout: 'default',
  computed: {
    ...mapGetters({
      user: 'auth/user',
      userExists: 'auth/userExists'
    })
  },
  head() {
    return {
      title: 'ログイン済みページ'
    }
  }
}
</script>
