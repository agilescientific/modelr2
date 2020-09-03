const HistoryValueGetSet = {
  computed: {
    value: {
      get() {
        return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName]
      },
      set(value) {
        this.$store.commit('history/setEventParam', {
          n: this.eventIndex, key: this.parameterName, value: value
        })
      }
    }
  }
}

export default {
  HistoryValueGetSet
}