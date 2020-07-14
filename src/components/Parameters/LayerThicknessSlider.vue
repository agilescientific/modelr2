<template>
  <v-slider
    :dense="true"
    class="text-capitalize py-0 mx-0"
    min="0"
    :max="modelExtent[5]"
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
      let payload = {
        n: this.eventIndex,
        key: this.parameterName,
        value: this.value
      }
      this.$store.dispatch('history/updateEventParam', payload)
    }
  },
  computed: {
    modelExtent() {
      return this.$store.state.modelExtent
    },
    layerName: {
      get() {
        return this.$store.state.history.events[this.eventIndex].parameters.layer_names[this.layerIndex]
      }
    },
    thicknesses: {
      get() {
        return this.$store.state.history.events[this.eventIndex].parameters.layer_thickness
      },
      set(value) {
        this.$store.dispatch('history/setEventParam', {
          n: this.eventIndex, key: "layer_thickness", value: value
        })
      }
    }
  }
}
</script>