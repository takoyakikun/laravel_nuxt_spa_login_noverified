<template>
  <v-form @submit.prevent="methods.submit()">
    <slot :submit="methods.submit" />
    <button v-show="false" type="submit" />
  </v-form>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { form } from '~/composition/form/form'

export default defineComponent({
  name: 'formComponent',
  setup(props, context) {
    const { methods } = form({ context })

    return { methods }
  }
})
</script>
