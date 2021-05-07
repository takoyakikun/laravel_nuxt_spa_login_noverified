<template>
  <!-- ダイアログ -->
  <v-dialog
    v-model="state.value"
    v-bind="state.options"
    @click:outside="outside"
  >
    <v-card>
      <v-app-bar dark :color="state.color" class="headline">
        <slot name="titleLeft" v-bind="{ state, closeDialog }">
          {{ state.title }}
        </slot>
        <v-spacer />
        <slot name="titleRight" v-bind="{ state, closeDialog }" />
        <slot name="titleClose" v-bind="{ state, closeDialog }">
          <v-btn data-test="titleCloseButton" icon="icon" @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </slot>
      </v-app-bar>

      <v-card-text class="mt-5">
        <slot name="content" v-bind="{ state, closeDialog }" />
      </v-card-text>

      <v-card-actions>
        <slot name="actionsLeft" v-bind="{ state, closeDialog }" />
        <v-spacer />
        <slot name="actionsRight" v-bind="{ state, closeDialog }" />
        <slot name="actionsClose" v-bind="{ state, closeDialog }">
          <v-btn data-test="actionsCloseButton" @click="closeDialog">
            <v-icon left>
              mdi-close
            </v-icon>
            閉じる
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent, useContext, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'myDialogComponent',
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  setup(props) {
    const { app } = useContext()

    // デフォルトのoptions
    const defaultOptions = {
      maxWidth: 600,
      scrollable: 'scrollable'
    }

    // ダイアログのステータスを作成する
    const state = reactive(app.$dialog.createDialog(props, defaultOptions))

    // ダイアログを開く
    const openDialog = () => {
      app.$dialog.openDialog(state.name)
    }

    // ダイアログを閉じる
    const closeDialog = () => {
      app.$dialog.closeDialog(state.name)
    }

    // ダイアログの外をクリック
    const outside = () => {
      if (state.options.persistent !== true) {
        closeDialog()
      }
    }

    return {
      state,
      openDialog,
      closeDialog,
      outside
    }
  }
})
</script>
