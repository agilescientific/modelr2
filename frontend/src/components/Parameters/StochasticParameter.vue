<template>
  <div>
    <v-sparkline
      :value="getPdf(getX(), value, scale)" :label="getX()"
      :show-labels="false" :fill="true" type="trend"
      :padding="0"
      :smooth="20"
      :auto-draw-duration="0" :auto-draw="false"
    ></v-sparkline>
    <v-row>
      <v-col>

        <v-slider
          v-bind:value="scale" label="σ" @click="setScale()"
          min="0.1" max="100" step="0.1"
          thumb-label dense
        ></v-slider>
      </v-col>
      <v-col>
        <v-slider
          v-model="skew" label="α"
          thumb-label disabled dense
        ></v-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
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
      },
      getX: function() {
        return linspace(30, 90, 51)
      },
      setScale: function() {
        console.log("flubidubi")
        this.$store.commit('history/SET_EVENT_VALUE', {
          i: this.eventIndex, p: this.parameterName, key: 'scale', value: this.scale
        })
      }
    },
    data() {
      return {
        x: undefined,
        y: undefined,
        sigma_max: this.value * 0.5,
      }
    },
    computed: {
      ...mapState({
        scale (state) {
          return state.history.events[this.eventIndex].parameters[this.parameterName].scale
        }
      }),
      value: function() {return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName].value},
      // scale: {
      //   get() {
      //     console.log()
      //     return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName].scale
      //   },
      //   set(value) {
      //     this.$store.commit('history/SET_EVENT_VALUE', {
      //       i: this.eventIndex, p: this.parameterName, key: 'scale', value: value})
      //   }
      // },
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