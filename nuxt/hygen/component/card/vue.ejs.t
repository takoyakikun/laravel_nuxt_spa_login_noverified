---
to: "components/<%= directory %>/<%= name ? name : 'index' %>.vue"
---
<template>
  <v-card>
    <v-toolbar color="<%= color ? color : 'primary' %>" dark flat>
      <v-toolbar-title><%= title %></v-toolbar-title>
    </v-toolbar>

    <v-card-text>
    </v-card-text>

    <% if (actions === true) { %>
    <v-card-actions>
      <v-btn data-test="leftButton">
        <v-icon left>
          mdi-chevron-left
        </v-icon>
        Left Button
      </v-btn>
      <v-spacer />
      <v-btn data-test="rightButton">
        <v-icon left>
          mdi-chevron-right
        </v-icon>
        Right Button
      </v-btn>
    </v-card-actions>
    <% } %>
  </v-card>
</template>

<script>
import { defineComponent, useContext, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  name: '<%= h.changeCase.pascal(directory) + h.changeCase.pascal(name) %>Component',
  props: {},
  components: {},
  setup(props) {
    const { app } = useContext()
    const state = reactive({})

    return {
      state
    }
  }
})
</script>
