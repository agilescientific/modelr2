<template>
  <v-slider
    :dense="true"
    class="text-capitalize py-0 mx-0"
    min="0"
    :max="modelExtent[5]"
    v-model="layerThickness"
    :label="layerName"
    thumb-label
  ></v-slider>
</template>

<script>
export default {
  name: 'Parameter',
  props: ['layerIndex'],
  computed: {
    modelExtent() {
      return this.$store.state.modelExtent
    },
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