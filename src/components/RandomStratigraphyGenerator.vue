<template>
  <div>
    <v-row>
      <v-col>Number of Layers</v-col>
      <v-col>
        <v-range-slider
          thumb-label="always"
          thumb-size="26"
          dense
          min="1"
          max="50"
          v-model="nLayers"
        ></v-range-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>Layer Thickness</v-col>
      <v-col>
        <v-range-slider
          thumb-label="always"
          thumb-size="30"
          dense
          min="1"
          :max="extent[5] / 10"
          v-model="thicknessBounds"
        ></v-range-slider>
      </v-col>
    </v-row>
    <v-btn dense class="primary" small @click="genSample()">
      Sample Stratigraphy
    </v-btn>

  </div>
</template>


<script>
  function getRndInteger(min, max) {
    // generates random integer between min and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  export default {
    name: "RandomStratigraphyGenerator",
    props: ['eventIndex'],
    data() {
      return {
          thicknessOptions: ["Uniform"],
          nLayers: [22, 29],
          thicknessBounds: [200, 275],
          num_layers: undefined,
          layer_thickness: undefined,
          layer_names: undefined,
          lithology: undefined,
      }
    },
    methods: {
      genSample: function() {
        // Generate Stratigraphy event sample
        this.genNumLayers()
        this.genLayers()
        let newParameters = this.genEvent()
        let parameters = this.$store.state.history.events[this.eventIndex].parameters
        for (const property in newParameters) {
          parameters[property] = newParameters[property]
        }
        this.$store.dispatch('history/updateEvent', {i: this.eventIndex, parameters: parameters})
      },
      genNumLayers: function() {
        // Generate number of layers based on range slider
        let min = this.nLayers[0];
        let max = this.nLayers[1];
        this.num_layers = getRndInteger(min, max);
      },
      genLayers: function() {
        // Generate layer thicknesses and names for Stratigraphy event
        let thicknesses = [];
        let names = [];
        let lithology = [];
        let min = this.thicknessBounds[0];
        let max = this.thicknessBounds[1];
        for (let i = 0; i <= this.num_layers; i += 1) {
          thicknesses.push(getRndInteger(min, max));
          names.push("Layer "+i);
          lithology.push(['Sandstone', 'Shale', 'Limestone', 'Black Shale', 'Coal'][getRndInteger(0,4)])
        }
        this.layer_thickness = thicknesses;
        this.layer_names = names;
        this.lithology = lithology;
      },
      genEvent: function() {
        let parameters = {};
        parameters.num_layers = {value: this.num_layers};
        parameters.layer_names = {value: this.layer_names};
        parameters.layer_thickness = {value: this.layer_thickness};
        parameters.lithology = {value: this.lithology};
        return parameters
      }
    }

  }
</script>

<style scoped>

</style>