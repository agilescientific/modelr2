<template>
  <div>
    <v-row>
      <v-col>Parameter</v-col>
      <v-col class="">Uncertain</v-col>
    </v-row>
    <div v-for="(_, name) in event.parameters" :key="name">
      <Parameter
        v-if="name !== 'pos' && name !== 'name'" :parameterName="name" :eventIndex="eventIndex"
      />
<!--      <ParameterSlider :parameterName=name :eventIndex="eventIndex" />-->
    </div>
  </div>
</template>

<script>
// import ParameterSlider from '@/components/Parameters/ParameterSlider.vue'
import Parameter from "../Parameters/Parameter";

export default {
  name: 'EventFault',
  props: ['eventIndex'],
  components: {
    Parameter,
    // ParameterSlider
  },
  computed: {
    event: function () {
      return this.$store.state.history.events[this.eventIndex];
    }
  }
}
</script>