<template>
  <div>
    <v-expansion-panel-header 
      color="primary--text"
      class="text-capitalize"
    >
      <template>
        {{ event.type }}<span class="ml-2 grey--text text--lighten-1">{{ eventIndex }}</span>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <EventGeneric v-if="event.type !== 'stratigraphy'" :eventIndex="eventIndex" />
      <EventStratigraphy v-if="event.type === 'stratigraphy'" :eventIndex="eventIndex" />
    </v-expansion-panel-content>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import EventGeneric from "./EventGeneric";
import EventStratigraphy from "./EventStratigraphy";
export default {
  name: 'Event',
  props: ['eventIndex'],
  components: {
    EventStratigraphy,
    EventGeneric
  },
  computed: {
    ...mapState('history', {
      event(state) {return state.events[this.eventIndex]}
    })
    // event: function () {
    //   return this.$store.state.history.events[this.eventIndex];
    // }
  }
}
</script>