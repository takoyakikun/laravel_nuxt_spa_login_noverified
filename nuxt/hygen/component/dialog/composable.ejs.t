---
to: "composables/<%= directory %>/dialogs/<%= name ? name : 'index' %>.js"
---
import { reactive, useContext } from '@nuxtjs/composition-api'

export default () => {
  const { app, store } = useContext()

  const state = reactive({
    value: false,
  })

  // ダイアログを開く
  const openDialog = () => {
    state.value = true
  }

  // ダイアログを閉じる
  const closeDialog = () => {
    state.value = false
  }

  return { state, openDialog, closeDialog }
}
