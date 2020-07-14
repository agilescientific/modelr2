<template>
  <v-speed-dial
    v-model="fab"
    :open-on-hover="true"
    direction="left"
    :top="true"
    :right="true"
    transition="slide-x-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
        color="grey lighten-2"
        fab
        light
        x-small
        @click="insertEvent()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-btn
      dark
      small
    >
        Fault
    </v-btn>
    <v-btn
      dark
      small
    >
      Fold
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'AddEvent',
  props: ['eventIndex'],
  data() {
    return {
      fab: '',
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
      this.$store.dispatch('history/updateEventInsert', {
        index: this.eventIndex,
        event: this.event
      });
    }
  }
}
</script>