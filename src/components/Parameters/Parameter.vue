<template>
  <div>
  <v-row>
    <v-col>
      <ParameterSlider :parameterName=parameterName :eventIndex=eventIndex />
    </v-col>
    <v-col class="my-auto">
      <v-switch
        dense
        v-model="isStochastic"
        class="ml-3 my-auto"
      ></v-switch>
    </v-col>
  </v-row>
    <v-expand-transition>
      <StochasticParameter v-show="isStochastic" />
    </v-expand-transition>
  </div>
</template>

<script>
import ParameterSlider from './ParameterSlider.vue';
import StochasticParameter from "./StochasticParameter";

  export default {
    name: "Parameter",
    components: {
      StochasticParameter,
      ParameterSlider
    },
    data() {
      return {
        // isStochastic: false
      }
    },
    props: ['parameterName', 'eventIndex'],
    computed: {
      isStochastic: {
        get() {
          let stochastic = this.$store.state.history.events[this.eventIndex].stochastic[this.parameterName]
          return stochastic !== undefined;
        }

      }
    }
  }
</script>

<style scoped>

</style>