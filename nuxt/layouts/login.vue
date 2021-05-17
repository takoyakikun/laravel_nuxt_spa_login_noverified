<template>
  <v-app id="inspire">
    <v-content>
      <nuxt />
    </v-content>

    <!-- snackbar -->
    <Snackbar />
  </v-app>
</template>

<script>
import Snackbar from '~/components/snackbar/snackbar'

export default {
  components: {
    Snackbar
  }
}
</script>
