---
to: "components/<%= directory %>/dialogs/<%= name ? name : 'index' %>.vue"
---
<template>
  <v-dialog v-model="state.value" max-width="600" scrollable>
    <v-card>
      <v-app-bar dark color="primary" class="headline">
        <span><%= title %></span>
        <v-spacer />
        <v-btn
          data-test="titleCloseButton"
          icon="icon"
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <v-card-text>
        
      </v-card-text>

      <v-card-actions>
        <v-btn data-test="actionsCloseButton" @click="closeDialog">
          <v-icon left>
            mdi-close
          </v-icon>
          閉じる
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  defineComponent,
  useContext,
  inject
} from '@nuxtjs/composition-api'
export default defineComponent({
  name: '<%= h.changeCase.pascal(directory) + h.changeCase.pascal(name) %>Component',
  props: {},
  components: {},
  setup(props, context) {
    const { app } = useContext()
    const { state, closeDialog } = inject('')

    return {
      state,
      closeDialog
    }
  }
})
</script>
