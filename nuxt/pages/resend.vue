<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <Resend />
    </v-col>
  </v-row>
</template>

<script>
import Resend from "~/components/resend/resend"

export default {
  middleware: "noVerified",
  layout: "login",
  components: {
    Resend
  }
}
</script>
