<template>
  <div>
  <v-row>
    <!--  slider  -->
    <v-col>
      <ParameterSlider
        :parameterName=parameterName
        :eventIndex=eventIndex
        :loc="loc"
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
        <StochasticParameter v-show="isUncertain" :eventIndex="eventIndex" :parameterName="parameterName" />
    </v-expand-transition>
  </div>
</template>

<script>
import ParameterSlider from './ParameterSlider.vue';
import StochasticParameter from "./StochasticParameter";

  export default {
    name: "Parameter",
    components: {ParameterSlider, StochasticParameter},
    props: ['parameterName', 'eventIndex', 'loc'],
    data() {
      return {
      }
    },
    computed: {
      isUncertain: {
        get() {
          return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName].uncertain
        },
        set(value) {
          this.$store.commit('history/TOGGLE_STOCHASTIC', {
            value: value,
            eventIndex: this.eventIndex,
            parameterName: this.parameterName
          })
          return value
        }
      }
    }
  }

</script>

<style scoped>

</style>