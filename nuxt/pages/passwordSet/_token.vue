<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <PasswordSet />
    </v-col>
  </v-row>
</template>

<script>
import PasswordSet from '~/components/passwordSet/_token'

export default {
  name: 'PasswordSetTokenPage',
  middleware: 'guest',
  layout: 'login',
  components: {
    PasswordSet
  },
  head() {
    return {
      title: 'パスワード登録'
    }
  }
}
</script>
