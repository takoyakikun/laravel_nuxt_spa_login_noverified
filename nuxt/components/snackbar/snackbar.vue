<template>
  <v-snackbar
    v-model="snackbar.value"
    v-bind="snackbar.options"
    @input="snackbar.closeSnackbar()"
  >
    <slot :text="snackbar.text">
      {{ snackbar.text }}
    </slot>
  </v-snackbar>
</template>

<script>
import { defineComponent, useContext, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'snackbarComponent',
  setup() {
    const { app } = useContext()
    const snackbar = reactive(app.$snackbar)
    return {
      snackbar
    }
  }
})
</script>
