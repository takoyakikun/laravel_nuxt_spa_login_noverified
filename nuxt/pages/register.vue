<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <Register />
    </v-col>
  </v-row>
</template>

<script>
import Register from "~/components/register/register"

export default {
  name: "RegisterPage",
  middleware: "guest",
  layout: "login",
  components: {
    Register
  },
  head() {
    return {
      title: "新規ユーザー登録"
    }
  }
}
</script>
