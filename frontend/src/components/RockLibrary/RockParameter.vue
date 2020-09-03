<template>
  <v-row>
    <v-col cols="3" class="text-capitalize">
      {{ property }}
    </v-col>
    <v-col cols="4">
      <v-text-field
          v-model="rock.properties[property].value"
          dense
          :suffix="suffixes[property]"
          filled
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "RockParameter",
  props: ['libraryName', 'property', 'index'],
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