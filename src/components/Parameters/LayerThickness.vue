<template>
  <v-slider
  min="0"
  max="1500"
  v-model="layerThickness"
  :label="layerName"
  ></v-slider>
</template>

<script>
export default {
  name: 'Parameter',
  props: ['layerIndex'],
  computed: {
    layerName: {
      get() {
        return this.$store.state.history.events[0].parameters.layer_names[this.layerIndex]
      }
    },
    layerThickness: {
      get() {
        return this.$store.state.history.events[0].parameters.layer_thickness[this.layerIndex]
      },
      set(value) {
        this.$store.dispatch('history/updateLayerThickness', {
          n: this.layerIndex, value: value
        })
      }
    }
  }
}
</script>