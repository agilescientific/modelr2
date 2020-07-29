<template>
  <v-slider
    :dense="true"
    class="text-capitalize py-0 mx-0"
    min="0"
    :max="extent[5] / 2"
    v-model="thicknesses[layerIndex]"
    :label="layerName"
    @click="updateModel()"
    thumb-label
  ></v-slider>
</template>

<script>
export default {
  name: 'LayerThicknessSlider',
  props: ['layerIndex', 'eventIndex'],
  methods: {
    updateModel() {
      let payload = {i: this.eventIndex, p: 'layer_thickness', key: 'value', value: this.thicknesses}
      this.$store.dispatch('history/updateEventParam', payload)
    }
  },
  computed: {
    layerName: {
      get() {
        return this.$store.state.history.events[this.eventIndex].parameters.layer_names.value[this.layerIndex]
      }
    },
    thicknesses: function() {
        return this.$store.state.history.events[this.eventIndex].parameters.layer_thickness.value
      }
    }
  }
</script>