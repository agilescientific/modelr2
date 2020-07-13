<template>
  <div>
    <v-row v-for="(layerName, index) in event.parameters.layer_names" :key="index">
      <v-col>
        <LayerThickness :layerIndex="index" />
      </v-col>
      <v-col class="my-0 py-0">
        <LayerLithology :layerIndex="index" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LayerThickness from '@/components/Parameters/LayerThickness.vue'
import LayerLithology from '@/components/Parameters/LayerLithology.vue'

export default {
  name: 'Stratigraphy',
  components: {
    LayerThickness,
    LayerLithology
  },
  computed: {
    event: function () {
      return this.$store.state.history.events[0];
    },
    value: {
      get() {
        return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName]
      },
      set(value) {
        this.$store.commit('history/setEventParam', {
          n: this.eventIndex, key: this.parameterName, value: value
        })
      }
    }
  }
}
</script>