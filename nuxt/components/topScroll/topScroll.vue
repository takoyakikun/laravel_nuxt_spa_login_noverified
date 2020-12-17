<template>
  <!-- トップスクロールボタン -->
  <v-btn
    v-show="showTopScroll"
    data-test="topScrollButton"
    v-bind="mergeButtonOptions"
    class="topScrollButton"
    @click="topScroll"
  >
    <slot :icon="icon">
      <v-icon>{{ icon }}</v-icon>
    </slot>
  </v-btn>
</template>

<script>
import goTo from "vuetify/es5/services/goto"
export default {
  props: {
    scrollOptions: {
      type: Object,
      default: () => ({})
    },
    buttonOptions: {
      type: Object,
      default: () => ({})
    },
    icon: {
      type: String,
      default: "mdi-chevron-up"
    }
  },
  data() {
    return {
      showTopScroll: false,
      defaultButtonOptions: {
        color: "primary",
        transition: "fade-transition",
        fixed: true,
        bottom: true,
        right: true,
        fab: true
      }
    }
  },
  computed: {
    // 入力されたオプションとデフォルトのオプションを組み合わせる
    mergeButtonOptions() {
      return Object.assign(this.defaultButtonOptions, this.buttonOptions)
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll)
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll)
  },
  methods: {
    // トップスクロールボタンを表示
    handleScroll() {
      this.showTopScroll = window.scrollY > 100
    },
    // 画面トップにスクロール
    topScroll() {
      goTo(0, this.scrollOptions)
    }
  }
}
</script>

<style lang="scss" scoped>
.topScrollButton {
  z-index: 100;
}
</style>
