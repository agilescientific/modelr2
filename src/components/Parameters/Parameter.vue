<template>
  <div>
  <v-row>
    <!--  slider  -->
    <v-col>
      <ParameterSlider :parameterName=name :eventIndex=eventIndex :loc="loc" />
    </v-col>
    <!--  uncertainty switch  -->
    <v-col class="my-auto">
<!--      <v-switch-->
<!--        dense-->
<!--        v-model="isStochastic"-->
<!--        class="ml-3 my-auto"-->
<!--      ></v-switch>-->
    </v-col>
    <!--  uncertainty parametrization  -->
  </v-row>
    <v-expand-transition>
<!--      <div v-show="isStochastic">-->
<!--        {{ getStoch(eventIndex, name) }}-->
<!--      </div>-->
<!--      <StochasticParameter v-show="isStochastic" />-->
    </v-expand-transition>
  </div>
</template>

<script>
import ParameterSlider from './ParameterSlider.vue';
// import { mapGetters } from 'vuex';
// import StochasticParameter from "./StochasticParameter";

  export default {
    name: "Parameter",
    components: {ParameterSlider},
    props: ['name', 'eventIndex', 'loc'],
    data() {
      return {
        // isStochastic: false
      }
    },
    computed: {
      // isStochastic: {
      //   get() {
      //     return this.$store.state.history.events[this.eventIndex].parameters[this.name]['uncertain']
      //   },
      //   set(value) {
      //     this.$store.commit('history/setEventParam', {
      //       eventIndex: this.eventIndex,
      //       parameterName: this.name,
      //       key: 'uncertain',
      //       value: value
      //     })
      //   }
      // },
      // watch: {
      //   isStochastic: function(newValue, oldValue) {
      //     console.log(oldValue, "->" ,newValue)
      //
      //   }
      // },
      // methods: {
      //   toggleStochastic() {
      //
      //   }
      // }
    }
  }
</script>

<style scoped>

</style>