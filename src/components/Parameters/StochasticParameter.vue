<template>
  <div>
    <v-sparkline
      :value="getPdf(x, value, scale)"
      :label="x"
      :show-labels="false"
      :fill="true"
      type="trend"
      :padding="12"
      :smooth="20"
      :auto-draw-duration="0"
      :auto-draw="false"
    ></v-sparkline>
    <v-row>
      <v-col>
        <v-slider
          dense
          label="σ"
          min="0.1"
          :max="30"
          step="0.1"
          v-model="scale"
          thumb-label
        ></v-slider>
      </v-col>
      <v-col>
        <v-slider
          dense
          label="α"
          v-model="skew"
          thumb-label
          disabled
        ></v-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  function linspace(a,b,n) {
    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    if (n < 2) { return n===1?[a]:[]; }
    let i, ret = Array(n);
    n--;
    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
  }

  function normalPdf(x, mean, stdev) {
    return 1 / (stdev * Math.sqrt(2*Math.PI)) * Math.exp(-0.5 * ((x - mean)/stdev)**2)
  }

  export default {
    name: "StochasticParameter",
    props: ['parameterName', 'eventIndex'],
    methods: {
      getPdf: function(x, mean, stdev) {
        return x.map(x => normalPdf(x, mean, stdev))
      }
    },
    data() {
      return {
        x: linspace(30, 90, 51),
        y: undefined,
        sigma_max: this.value * 0.5,
      }
    },
    computed: {
      value: function() {return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName].value},
      scale: {
        get() {
          return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName].scale
        },
        set(value) {
          this.$store.commit('history/SET_EVENT_VALUE', {
            i: this.eventIndex, p: this.parameterName, key: 'scale', value: value})
        }
      },
      skew: {
        get() {
          return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName].skew
        },
        set(value) {
          this.$store.commit('history/SET_EVENT_VALUE', {
            i: this.eventIndex, p: this.parameterName, key: 'skew', value: value})
        }
      },
    }
  }
</script>

<style scoped>

</style>