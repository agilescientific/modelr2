<template>
  <div>
    <v-row v-for="(_, index) in event.parameters.layer_names.value" :key="index">
      <v-col>
        <LayerThicknessSlider :eventIndex="eventIndex" :layerIndex="index" />
      </v-col>
<!--      <v-col class="my-0 py-0">-->
<!--        <LayerLithology :eventIndex="eventIndex" :layerIndex="index" />-->
<!--      </v-col>-->
    </v-row>
  </div>
</template>

<script>
import LayerThicknessSlider from '@/components/Parameters/LayerThicknessSlider.vue'
// import LayerLithology from '@/components/Parameters/LayerLithology.vue'

export default {
  name: 'Stratigraphy',
  props: ['eventIndex'],
  components: {
    LayerThicknessSlider,
    // LayerLithology
  },
  computed: {
    event: function () {
      return this.$store.state.history.events[this.eventIndex];
    },
  }
}
</script>