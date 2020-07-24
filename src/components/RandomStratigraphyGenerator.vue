<template>
  <div>
    <v-row>
      <v-col></v-col>
      <v-col>
      </v-col>
      <v-col>
        <v-btn class="primary" small @click="genSample()">
          Sample Stratigraphy
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Number of Layers
        <span class="grey--text">
          scipy.stats.randint({{ nLayers[0] }}, {{ nLayers[1] + 1}})
        </span>
      </v-col>
      <v-col>
        <v-range-slider
          thumb-label
          dense
          min="1"
          max="50"
          v-model="nLayers"
        ></v-range-slider>
      </v-col>
      <v-col>{{ num_layers }}</v-col>
    </v-row>
    <v-row>
      <v-col>
        Layer Thickness
        <span class="grey--text">
          scipy.stats.uniform({{ thicknessBounds[0] }}, {{ thicknessBounds[1] - thicknessBounds[0]}})
        </span>
      </v-col>
<!--      <v-col>-->
<!--        <v-select-->
<!--          dense-->
<!--          :items="thicknessOptions"-->
<!--          label="Distribution Type"-->
<!--          :value="thicknessOptions[0]"-->
<!--        ></v-select>-->
<!--      </v-col>-->
      <v-col>
        <v-range-slider
          thumb-label
          dense
          min="1"
          :max="extent[5] / 15"
          v-model="thicknessBounds"
        ></v-range-slider>
      </v-col>
      <v-col>{{ layer_thickness }}</v-col>
    </v-row>


  </div>
</template>


<script>
  function getRndInteger(min, max) {
    // generates random integer between min and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  // function getRndUniform(min, max) {
  //   // generates random integer between min and max (inclusive)
  //   return Math.random() * (max - min + 1) + min;
  // }
  export default {
    name: "RandomStratigraphyGenerator",
    data() {
      return {
          thicknessOptions: ["Uniform"],
          nLayers: [16, 22],
          thicknessBounds: [100, 150],
          num_layers: undefined,
          layer_thickness: undefined,
          layer_names: undefined,
      }
    },
    methods: {
      genSample: function() {
        // Generate Stratigraphy event sample
        this.genNumLayers()
        this.genLayers()
        let parameters = this.genEvent()
        this.$store.dispatch('history/updateEvent', {i: 0, parameters: parameters})
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
        let min = this.thicknessBounds[0];
        let max = this.thicknessBounds[1];
        for (let i = 0; i <= this.num_layers; i += 1) {
          thicknesses.push(getRndInteger(min, max));
          names.push("Layer "+i);
        }
        this.layer_thickness = thicknesses;
        this.layer_names = names;
      },
      genEvent: function() {
        let parameters = {};
        parameters.num_layers = {value: this.num_layers};
        parameters.layer_names = {value: this.layer_names};
        parameters.layer_thickness = {value: this.layer_thickness};
        return parameters
      }
    }

  }
</script>

<style scoped>

</style>