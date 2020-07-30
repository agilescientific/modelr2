<template>
  <div>
    <div>
      <v-slider
        :min="minValues[parameterName]"
        :max="maxValues[parameterName]"
        v-model="value"
        thumb-label
        color="grey darken-3"
        track-color="grey darken-3"
        dense
        @click="updateModel()"
        class="text-capitalize"
      >
<!--        <template v-slot:prepend>-->
<!--          <div>-->
<!--            {{ minValues[parameterName] }}-->
<!--          </div>-->
<!--        </template>-->
<!--        <template v-slot:append>{{ maxValues[parameterName] }}-->
<!--        </template>-->
      </v-slider>

    </div>
  </div>
</template>

<script>

export default {
  name: 'Parameter',
  props: ['parameterName', 'eventIndex', 'loc'],
  methods: {
    updateModel() {
      let payload = {
        i: this.eventIndex,
        p: this.parameterName,
        key: 'value',
        value: this.value
      }
      this.$store.dispatch('history/updateEventParam', payload)
    }
  },
  computed: {
    value: {
      get() {
        return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName].value
      },
      set(value) {
        this.$store.commit('history/SET_EVENT_VALUE', {
          i: this.eventIndex, p: this.parameterName, key: 'value', value: value
        })
      }
    }
  }
}
</script>