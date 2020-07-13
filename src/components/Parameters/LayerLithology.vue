<template>
<v-row>
  <v-col class="my-0 py-0">
    <v-select
      class="my-0 py-0"
      :items="rockNames"
      v-model="name"
      label="Lithology"
      dense
  ></v-select>
  {{ density }}
  </v-col>
  <!-- <v-col class="my-0 py-0">
    <v-text-field
      class="my-0 py-0"
      dense
      type="number"
      :label="density"
    ></v-text-field>
  </v-col> -->
</v-row>
</template>

<script>
// import { mapState } from 'vuex';
// TODO: auto-load dropdown options from state

export default {
  name: 'LayerLithology',
  props: ['layerIndex'],
  computed: {
    rockNames() {
      return Object.keys(this.$store.state.rockDensities)
    },
    rockDensities() {
      return Object.values(this.$store.state.rockDensities)
    },
    rockName() {
      return this.$store.state.history.events[0].parameters.lithology[this.layerIndex]
    },
    name: {
      get() {
        return this.$store.state.history.events[0].parameters.lithology[this.layerIndex]
      },
      set(value) {
        console.log(value)
        this.$store.commit('history/setLayerLithology', {
          n: this.layerIndex, value: value
        });
        this.$store.commit('history/setLayerDensity', {
          n: this.layerIndex, value: this.$store.state.rockDensities[value]
        });
      }
    },
    density: {
      get() {
        return this.$store.state.history.events[0].parameters.density[this.layerIndex]
      },
      set(value) {
        this.$store.commit('history/setLayerDensity', {
          n: this.layerIndex, value: value
        })
      }
    }
  }
}
</script>