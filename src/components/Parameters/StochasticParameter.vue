<template>
  <div>
    <v-sparkline
      :value="y"
      :label="x"
      :show-labels="true"
      :fill="true"
      type="trend"
      :padding="12"
      :smooth="20"
      auto-draw
    ></v-sparkline>
    <v-row class="white lighten-2">
      <v-col>
        <v-select
          :items="['Normal', 'Uniform']"
          label="Distribution"
          solo
          dense
        ></v-select>
      </v-col>
      <v-col>
        <v-slider label="σ"></v-slider>
      </v-col>
      <v-col>
        <v-slider label="α"></v-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  let { jStat } = require('jstat');

  function linspace(a,b,n) {
    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    if(n<2) { return n===1?[a]:[]; }
    var i,ret = Array(n);
    n--;
    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
  }

  export default {
    name: "StochasticParameter",
    data() {
      return {
        x: linspace(-3, 3, 3).map(x => Math.round(x)),
        y: linspace(-3, 3, 3).map(x => jStat.normal.pdf(x, 0, 1))
      }
    },
    computed: {
      // TODO: get/set for mean, stdev
    }
  }
</script>

<style scoped>

</style>