<template>
  <div>
    <v-expansion-panel-header 
      color="primary--text"
      class="text-capitalize"
    >
      <template>
        {{ event.type }} <span class="ml-2 grey--text text--lighten-1">eventIndex {{ eventIndex }}</span>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <EventFold v-if="event.type === 'fold'" :eventIndex="eventIndex" />
      <EventUnconformity v-if="event.type === 'unconformity'" :eventIndex="eventIndex" />
      <EventStratigraphy v-if="event.type === 'stratigraphy'" :eventIndex="eventIndex" />
      <EventFault v-if="event.type === 'fault'" :eventIndex="eventIndex" />
    </v-expansion-panel-content>
  </div>
</template>

<script>
import EventStratigraphy from '@/components/Events/Stratigraphy.vue';
import EventFault from '@/components/Events/Fault.vue';
import EventUnconformity from '@/components/Events/Unconformity.vue';
import EventFold from '@/components/Events/Fold.vue';

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