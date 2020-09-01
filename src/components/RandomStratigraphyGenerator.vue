<template>
  <div>
    <v-row>
      <v-col cols="9">
        <p class="mb-10 font-weight-light text-body-1">
          Select a rock library and settings for the probabilistic simulation
          of stratigraphic layer cake models.
        </p>
      </v-col>
    </v-row>
    <v-select
        label="Model"
        :items="['Discrete uniform distribution']"
        v-model="currentModel"
        disabled
    >
    </v-select>
    <v-row>
      <v-col cols="4">Number of Layers</v-col>
      <v-col>
        <v-slider
          thumb-label="always"
          thumb-size="26"
          min="0"
          max="200"
          dense
          v-model="nLayers"
          @click="setStochasticStratigraphy()"
        ></v-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">Layer Thicknesses</v-col>
      <v-col>
        <v-range-slider
          thumb-label="always"
          thumb-size="30"
          dense
          min="1"
          :max="extent[5] / 10"
          v-model="thicknessBounds"
          @click="setStochasticStratigraphy()"
        ></v-range-slider>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  export default {
    name: "RandomStratigraphyGenerator",
    props: ['eventIndex'],
    data() {
      return {
        currentModel: 'Discrete uniform distribution',
        thicknessOptions: ["Uniform"],
        nLayers: 50,
        thicknessBounds: [200, 275],
        num_layers: undefined,
        layer_thickness: undefined,
        layer_names: undefined,
        lithology: undefined,
      }
    },
    methods: {
      setStochasticStratigraphy: function() {
        let num_layers = {
            uncertain: true,
            value: this.nLayers
          }
        let layer_thickness = {
          uncertain: true,
          distribution: 'uniform',
          low: this.thicknessBounds[0],
          high: this.thicknessBounds[1],
        }
        this.$store.commit(
            'history/SET_EVENT_PARAM',
            {
              i: this.eventIndex,
              p: 'layer_thickness',
              value: layer_thickness
            }
        )
        this.$store.commit(
          'history/SET_EVENT_PARAM',
          {
            i: this.eventIndex,
            p: 'num_layers',
            value: num_layers
          }
        )
        this.$store.dispatch('preview/updatePreview')
      },
    }

  }
</script>

<style scoped>

</style>