<template>
  <div>
    <v-row>
      <!--  slider  -->
      <v-col>
        <ParameterSlider
          :parameterName=parameterName
          :eventIndex=eventIndex
          :loc="loc"
          setting="value"
        />
      </v-col>
      <!--  uncertainty switch  -->
      <v-col class="my-auto">
        <v-switch
          dense
          v-model="isUncertain"
          class="ml-3 my-auto"
        />
      </v-col>
    </v-row>
    <!--  uncertainty parametrization  -->
    <v-expand-transition>
      <v-row class="px-0" v-show="isUncertain">
        <v-col >
            <v-slider
              label="σ" dsense v-model="scale" thumb-label
              step="0.1" min="1" :max="this.maxValues[this.parameterName] / 5"
            ></v-slider>
            <v-slider dense label="α" disabled></v-slider>
        </v-col>
        <v-col>
          <v-sparkline class="distplot"
            :value="getPdf(getX(), value, scale)" :label="getX()"
            :show-labels="false" :fill="false" type="trend"
            :padding="2"
            line-width="2"
            :smooth="20"
            :auto-draw-duration="0" :auto-draw="false"
          ></v-sparkline>
        </v-col>
      </v-row>
    </v-expand-transition>
  </div>
</template>

<script>
import ParameterSlider from './ParameterSlider.vue';

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
    name: "Parameter",
    components: {ParameterSlider},
    props: ['parameterName', 'eventIndex', 'loc'],
    methods: {
      getPdf: function(x, mean, stdev) {
        return x.map(x => normalPdf(x, mean, stdev))
      },
      getX: function() {
        return linspace(
          this.minValues[this.parameterName],
          this.maxValues[this.parameterName],
          501
        )
      },
    },
    computed: {
      isUncertain: {
        get() {
          return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName].uncertain
        },
        set(value) {
          this.$store.commit('history/TOGGLE_STOCHASTIC', {
            value: value, eventIndex: this.eventIndex, parameterName: this.parameterName})
        }
      },
      scale: {
        get() {
          return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName].scale
        },
        set(value) {
          this.$store.commit('history/SET_EVENT_VALUE', {
            i: this.eventIndex, p: this.parameterName, key: 'scale', value: value})
        }
      },
      value: {
        get() {
          return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName].value
        },
        set(value) {
          this.$store.commit('history/SET_EVENT_VALUE', {
            i: this.eventIndex, p: this.parameterName, key: 'value', value: value})
        }
      }
    }
  }

</script>

<style scoped>
  .distplot {
    border-left: 2px solid lightgray;
    border-right: 2px solid lightgray;
  }
</style>