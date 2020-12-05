<template>
  <!-- ダイアログ -->
  <v-dialog v-model="dialog" v-bind="mergeOptions" @click:outside="outside">
    <v-card>
      <v-app-bar dark :color="color" class="headline">
        <slot name="titleLeft" :color="color" :close="close" :title="title">
          {{ title }}
        </slot>
        <v-spacer />
        <slot name="titleRight" :color="color" :close="close" :title="title" />
        <slot name="titleClose" :color="color" :close="close">
          <v-btn data-test="titleCloseButton" icon="icon" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </slot>
      </v-app-bar>

      <v-card-text class="mt-5">
        <slot name="content" :color="color" :close="close" />
      </v-card-text>

      <v-card-actions>
        <slot name="actionsLeft" :color="color" :close="close" />
        <v-spacer />
        <slot name="actionsRight" :color="color" :close="close" />
        <slot name="actionsClose" :color="color" :close="close">
          <v-btn data-test="actionsCloseButton" @click="close">
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
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
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
      default: ""
    },
    color: {
      type: String,
      default: "primary"
    }
  },
  data() {
    return {
      defaultOptions: {
        maxWidth: 600,
        scrollable: "scrollable"
      }
    }
  },
  computed: {
    // 入力されたオプションとデフォルトのオプションを組み合わせる
    mergeOptions() {
      return Object.assign(this.defaultOptions, this.options)
    },
    // name が指定されている場合はストアから、ない場合は value から状態を取得
    dialog() {
      if (this.name) {
        return this.$store.getters["dialog/dialog"](this.name)
      } else {
        return this.value
      }
    }
  },
  methods: {
    // ダイアログの外をクリック
    outside() {
      if (!this.mergeOptions.persistent) {
        this.close()
      }
    },
    // ダイアログを閉じる
    close() {
      if (this.name) {
        this.$store.dispatch("dialog/closeDialog", this.name)
      } else {
        this.$emit("input", false)
      }
    }
  }
}
</script>
