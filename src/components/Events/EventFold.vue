<template>
  <div>
    <div v-for="(value, name) in event.parameters" :key="name">
      <ParameterSlider :parameterName=name :eventIndex=eventIndex />
    </div>
  </div>
</template>

<script>
import ParameterSlider from '@/components/Parameters/ParameterSlider.vue'

export default {
  name: 'EventFold',
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

