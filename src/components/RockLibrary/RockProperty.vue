<template>
    <v-text-field
        v-model="rock[property]"
        dense
        :suffix="suffixes[property]"
        filled
        :label="property | capitalize"
    ></v-text-field>
</template>

<script>
export default {
  name: "RockProperty",
  props: ['index', 'property'],
  data() {
    return {
      suffixes: {
        density: "kg/m³",
        vp: "m/s",
      }
    }
  },
  computed: {
    rock: {
      get() {
        return this.$store.state.rockLibrary.library[this.index]
      },
      set(value) {
        this.$store.state.rockLibrary.library[this.index] = value
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