<template>
  <div>
    <v-expansion-panel-header 
      color="primary--text"
      class="text-capitalize"
    >
      {{ event.type }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <EventFold v-if="event.type === 'fold'" :eventIndex="eventIndex" />
      <EventUnconformity v-if="event.type === 'unconformity'" :eventIndex="eventIndex" />
      <EventStratigraphy v-if="event.type === 'stratigraphy'" :eventIndex="eventIndex" />
      <EventFault v-if="event.type === 'fault'" :eventIndex="eventIndex" />
    </v-expansion-panel-content>

    <v-btn
      color="grey lighten-2"
      fab
      light
      x-small
      absolute
      bottom
      :style="{left: '45%'}"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import EventStratigraphy from '@/components/Events/EventStratigraphy.vue';
import EventFault from '@/components/Events/EventFault.vue';
import EventUnconformity from '@/components/Events/EventUnconformity.vue';
import EventFold from '@/components/Events/EventFold.vue';

export default {
  name: 'Event',
  props: ['eventIndex'],
  components: {
    EventStratigraphy,
    EventFault,
    EventUnconformity,
    EventFold
  },
  computed: {
    event: function () {
      return this.$store.state.history.events[this.eventIndex];
    }
  }
}
</script>