<template>
  <div>
    <v-card class="mx-auto">
      <v-card-title class="primary--text">History</v-card-title>
      <v-card-subtitle>Define an uncertain geomodel history.</v-card-subtitle>
      <v-expansion-panels :multiple="true" :hover="true">
        <v-expansion-panel v-for="(event, eventIndex) in history" :key="eventIndex">
          <Event :eventIndex="eventIndex" />
          <DeleteEvent v-if="eventIndex > 0" :eventIndex="eventIndex" />
          <AddEvent :eventIndex="eventIndex" />
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Event from '@/components/Events/Event.vue';
import AddEvent from '@/components/Events/AddEvent.vue';
import DeleteEvent from "./Events/DeleteEvent";

export default {
  name: 'History',
  components: {
    DeleteEvent,
    Event,
    AddEvent
  },
  computed: mapState({
    history: state => state.history.events
  })
};
</script>
