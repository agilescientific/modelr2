<template>
  <v-text-field
    v-model="rock[property]"
    type="number"
    dense
    :label="property | capitalize"
  ></v-text-field>
</template>

<script>
export default {
  name: "RockProperty",
  props: ['index', 'libraryName', 'property'],
  computed: {
    rock: {
      get() {
        return this.$store.state.rockLibrary.libraries[this.libraryName][this.index]
      },
      set(value) {
        this.$store.state.rockLibrary.libraries[this.libraryName][this.index] = value
      }
    }
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>

<style scoped>

</style>