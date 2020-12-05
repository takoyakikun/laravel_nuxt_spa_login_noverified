<template>
  <v-form @submit.prevent="submit()">
    <slot :submit="submit" />
    <button v-show="false" type="submit" />
  </v-form>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    submit() {
      this.$emit("submit")
    }
  }
}
</script>
