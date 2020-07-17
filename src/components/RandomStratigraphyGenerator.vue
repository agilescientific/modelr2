<template>
  <div>
    <v-row>
      <v-col>
        Number of Layers
        <span class="grey--text">scipy.stats.randint({{ nLayers[0] }}, {{ nLayers[1] + 1}})</span>
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
    </v-row>
    <v-row>
      <v-col>
        Layer Thickness
      </v-col>
      <v-col>
        <v-select
          dense
          :items="thicknessOptions"
          label="Distribution Type"
        ></v-select>
      </v-col>
      <v-col>
        <v-range-slider
          thumb-label
          dense
          min="1"
          max="600"
          v-model="thicknessBounds"
        ></v-range-slider>
      </v-col>
    </v-row>


  </div>
</template>

<script>
  export default {
    name: "RandomStratigraphyGenerator",
      data() {
        return {
            thicknessOptions: ["Uniform", "Normal"],
            nLayers: [16, 22],
            thicknessBounds: [100, 250]
        }
      }
  }
</script>

<style scoped>

</style>