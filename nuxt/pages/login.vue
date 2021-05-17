<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <Login />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Login from '~/components/login/login'

export default {
  name: 'LoginPage',
  middleware: 'guest',
  layout: 'login',
  components: {
    Login
  },
  head() {
    return {
      title: 'ログイン'
    }
  }
}
</script>
