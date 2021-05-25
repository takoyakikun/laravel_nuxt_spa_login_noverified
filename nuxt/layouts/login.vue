<template>
  <v-app id="inspire">
    <v-main>
      <nuxt />
    </v-main>

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
