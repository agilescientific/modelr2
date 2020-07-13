<template>
  <div>
    <div v-for="(value, name) in event.parameters" :key="name">
      <Parameter :parameterName=name :eventIndex=eventIndex />
    </div>
  </div>
</template>

<script>
import Parameter from '@/components/Parameters/Parameter.vue'

export default {
  name: 'EventFold',
  props: ['eventIndex'],
  components: {
    Parameter
  },
  computed: {
    event: function () {
      return this.$store.state.history.events[this.eventIndex];
    }
  }
}
</script>

