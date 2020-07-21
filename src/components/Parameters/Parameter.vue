<template>
  <div>
  <v-row>
    <!--  slider  -->
    <v-col>
      <ParameterSlider :parameterName=name :eventIndex=eventIndex :loc="loc" />
    </v-col>
    <!--  uncertainty switch  -->
    <v-col class="my-auto">
      <v-switch
        dense
        v-model="isStochastic"
        class="ml-3 my-auto"
      ></v-switch>
    </v-col>
    <!--  uncertainty parametrization  -->
  </v-row>
    <v-expand-transition>
      <div v-show="isStochastic">Stochastic</div>
<!--      <StochasticParameter v-show="isStochastic" />-->
    </v-expand-transition>
  </div>
</template>

<script>
import ParameterSlider from './ParameterSlider.vue';
// import StochasticParameter from "./StochasticParameter";

  export default {
    name: "Parameter",
    components: {ParameterSlider},
    props: ['name', 'eventIndex', 'loc'],
    data() {
      return {
        isStochastic: false
      }
    },
    computed: {}
  }
</script>

<style scoped>

</style>