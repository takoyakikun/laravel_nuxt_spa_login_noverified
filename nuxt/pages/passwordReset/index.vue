<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <PasswordReset />
    </v-col>
  </v-row>
</template>

<script>
import PasswordReset from "~/components/PasswordReset/index"

export default {
  middleware: "guest",
  layout: "login",
  components: {
    PasswordReset
  }
}
</script>
