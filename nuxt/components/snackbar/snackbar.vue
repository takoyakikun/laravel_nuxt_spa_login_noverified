<template>
  <v-snackbar v-bind="options" :value="value" @input="closeSnackbar">
    <slot :text="text">
      {{ text }}
    </slot>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  computed: {
    ...mapGetters("snackbar", ["value", "text", "options"])
  },
  methods: {
    ...mapActions("snackbar", ["closeSnackbar"])
  }
}
</script>
