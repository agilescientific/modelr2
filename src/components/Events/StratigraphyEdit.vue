<template>
  <div>
    <div v-for="(_, index) in event.parameters.layer_names.value" :key="index" >
      <v-divider></v-divider>
      <div class="d-flex justify-space-around pt-5">
        <LayerThicknessSlider :style="{width: '100px'}" :eventIndex="eventIndex" :layerIndex="index" />
        <v-select
          class="ml-3"
          @change="updatePreview()"
          :style="{width: '200px'}"
          dense
          label="Lithology"
          :items="lithOptions"
          v-model="lithology[index]"
        ></v-select>
        <v-btn class="ml-3" small @click="deleteLayer(index)" :icon="true">
          <span class="material-icons">delete_outline</span>
        </v-btn>
        <v-btn small @click="addLayer(index)" :icon="true">
          <span class="material-icons">add</span>
        </v-btn>
      </div>

    </div>

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
      console.log("lel")
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
        this.$store.state.history.events[this.eventIndex].parameters.lithology.value = value

      }
    }
  },
  methods: {
    updatePreview: function() {
      this.$store.dispatch('preview/updatePreview')
    },
    deleteLayer: function(index) {
      this.$store.dispatch(
          'history/updateLayerDelete',
          {eventIndex: this.eventIndex, layerIndex: index}
      )
    },
    addLayer: function(index) {
      this.$store.dispatch(
        'history/updateLayerAdd',
          {eventIndex: this.eventIndex, layerIndex: index}
      )
    }
  }
}
</script>