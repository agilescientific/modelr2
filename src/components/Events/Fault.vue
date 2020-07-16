<template>
  <div>
    <div v-for="(_, name) in event.parameters" :key="name">
      <ParameterSlider :parameterName=name :eventIndex=eventIndex />
    </div>
  </div>
</template>

<script>
import ParameterSlider from '@/components/Parameters/ParameterSlider.vue'

export default {
  name: 'EventFault',
  props: ['eventIndex'],
  components: {
    ParameterSlider
  },
  computed: {
    event: function () {
      return this.$store.state.history.events[this.eventIndex];
    }
  }
}
</script>