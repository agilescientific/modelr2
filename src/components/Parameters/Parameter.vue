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
    <!--  uncertainty parametrization  -->
  </v-row>
    <v-expand-transition>
      <v-row v-show="isUncertain">
        <v-slider label="σ" dsense v-model="scale"></v-slider>
      </v-row>
    </v-expand-transition>
<!--    <v-expand-transition>-->
<!--        <StochasticParameter v-show="isUncertain" :eventIndex="eventIndex" :parameterName="parameterName" />-->
<!--    </v-expand-transition>-->
  </div>
</template>

<script>
import ParameterSlider from './ParameterSlider.vue';
// import StochasticParameter from "./StochasticParameter";

  export default {
    name: "Parameter",
    components: {ParameterSlider},
    props: ['parameterName', 'eventIndex', 'loc'],
    methods: {},
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
      }
    }
  }

</script>

<style scoped>

</style>