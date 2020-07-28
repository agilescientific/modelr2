<template>
  <div>
    <v-card class="mx-auto">
      <v-card-title class="primary--text">
        History
        <v-btn style="position: absolute; right: 0" x-small class="mr-5">Export</v-btn>
      </v-card-title>
      <v-card-subtitle>Define an uncertain geomodel history.</v-card-subtitle>
      <v-expansion-panels :multiple="true" :hover="true">
        <v-expansion-panel v-for="(_, eventIndex) in history" :key="eventIndex">
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
import Event from './Events/EventContainer.vue';
import AddEvent from './Events/AddEvent.vue';
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
