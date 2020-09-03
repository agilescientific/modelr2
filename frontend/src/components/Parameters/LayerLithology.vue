<template>
<v-row>
  <v-col class="my-0 py-0">
    <v-select
      class="my-0 py-0"
      :items="rockNames"
      v-model="names[layerIndex]"
      label="Lithology"
      dense
  ></v-select>
  </v-col>
</v-row>
</template>

<script>
// import { mapState } from 'vuex';
// TODO: auto-load dropdown options from state

export default {
  name: 'LayerLithology',
  props: ['layerIndex', 'eventIndex'],
  computed: {
    rockDensities() {
      return this.$store.state.rockLibrary.libraries
    },
    rockNames() {
      return Object.keys(this.$store.state.rockDensities)
    },
    rockName() {
      return this.$store.state.history.events[0].parameters.lithology[this.layerIndex]
    },
    names: {
      get() {
        return this.$store.state.history.events[this.eventIndex].parameters.lithology
      },
      set(value) {
        this.$store.commit('history/setEventParam', {
          n: this.eventIndex, key: "lithology", value: value
        });
      }
    },
    densities: {
      get() {
        return this.$store.state.history.events[this.eventIndex].parameters.density
      },
      set(value) {
        this.$store.commit('history/setEventParam', {
          n: this.eventIndex, key: "density", value: value
        })
      }
    }
  }
}
</script>