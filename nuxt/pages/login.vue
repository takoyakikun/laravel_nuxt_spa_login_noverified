<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <login />
    </v-col>
  </v-row>
</template>

<script>
import Login from "~/components/login/login"

export default {
  middleware: "guest",
  layout: "login",
  components: {
    Login
  }
}
</script>
