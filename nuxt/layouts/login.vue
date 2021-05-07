<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <nuxt />
      </v-container>
    </v-content>

    <!-- snackbar -->
    <Snackbar />
  </v-app>
</template>

<script>
import Snackbar from '@/components/snackbar/snackbar'

export default {
  components: {
    Snackbar
  }
}
</script>
