<template>
  <v-btn
    color="grey lighten-2"
    fab
    light
    x-small
    absolute
    bottom
    :style="{left: '45%'}"
    @click="insertEvent()"
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'AddEvent',
  props: ['eventIndex'],
  data() {
    return {
      event: {
        type: "fault",
        name: "Fault",
        parameters: {
          pos: [7000, 0, 6000],
          dip: 60,
          dip_dir: 270,
          slip: 750
        }
      }
    }
  },
  methods: {
    insertEvent() {
      this.$store.commit('history/insertEvent', {
        index: this.eventIndex,
        event: this.event
      })
    }
  }
}
</script>