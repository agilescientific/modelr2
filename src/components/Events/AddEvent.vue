<template>
  <v-speed-dial
    v-model="eventType"
    class="mr-12 speeddial"
    :open-on-hover="false"
    direction="left"
    :top="true"
    :right="true"
    absolute
    transition="slide-x-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
        color="grey lighten-3"
        class="elevation-0"
        fab
        x-small
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-btn
      v-for="event in Object.keys(events)" :key="event"
      x-small
      @click="insertEvent(event)"
    >
      {{ event }}
    </v-btn>

  </v-speed-dial>
</template>

<script>
export default {
  name: 'AddEvent',
  props: ['eventIndex'],
  data() {
    return {
      eventType: '',
      events: {
        fault: {
          type: "fault",
          name: "Fault",
          parameters: {
            pos: [7000, 0, 6000],
            dip: 60,
            dip_dir: 270,
            slip: 750
          }
        },
        fold: {
          type: "fold",
          name: "Fold",
          parameters: {
            pos: [200, 0, 700],
            amplitude: 100,
            wavelength: 10000
          }
        }
      },
    }
  },
  methods: {
    insertEvent(type) {
      this.$store.dispatch('history/updateEventInsert', {
        index: this.eventIndex,
        event: this.events[type]
      });
    }
  }
}
</script>

<style scoped>
.speeddial {
  margin-top: -9px;
  box-shadow: 0px 0px white;
}
</style>