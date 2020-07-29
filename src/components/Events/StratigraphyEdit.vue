<template>
  <div>
    <v-row v-for="(_, index) in event.parameters.layer_names.value" :key="index">
      <v-col>
        <LayerThicknessSlider :eventIndex="eventIndex" :layerIndex="index" />
      </v-col>
      <v-col class="my-0 py-0">
        <v-select dense label="Lithology" :items="lithOptions" v-model="lithology[index]"></v-select>
      </v-col>
      <v-col cols="1" class="my-0 py-0"><div :style="{'backgorund-color': '#000000'}">.</div></v-col>
      <v-col cols="1" class="my-0 py-0">
        <v-btn small @click="deleteLayer(index)" :icon="true">
          <span class="material-icons">delete_outline</span>
        </v-btn>
      </v-col>
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
    lithOptions: function() {
      let currentLibrary = this.$store.state.rockLibrary.currentLibrary
      return this.$store.state.rockLibrary.libraries[currentLibrary].map(x => x.name)
    },
    lithology: {
      get() {
        return this.$store.state.history.events[this.eventIndex].parameters.lithology.value
      },
      set(value) {
        return this.$store.state.history.events[this.eventIndex].parameters.lithology.value = value
      }
    }
  },
  methods: {
    deleteLayer: function(index) {
      this.$store.dispatch(
          'history/updateLayerDelete',
          {eventIndex: this.eventIndex, layerIndex: index}
      )
    }
  }
}
</script>