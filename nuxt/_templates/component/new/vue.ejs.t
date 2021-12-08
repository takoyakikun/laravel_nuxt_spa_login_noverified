---
to: "components/<%= directory %>/<%= name ? name : 'index' %>.vue"
---
<template>
</template>

<script>
import { defineComponent, useContext, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  name: '<%= h.changeCase.pascal(directory) + h.changeCase.pascal(name) %>Component',
  props: {},
  setup(props) {
    const { app } = useContext()
    const state = reactive({})

    return {
      state
    }
  }
})
</script>
