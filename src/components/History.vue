<template>
  <v-container class="mt-5">
    <v-row>
      <v-col class="font-weight-light text-body-1 pl-10 pr-10" cols="8">
         Define an uncertain geomodel history by randomly generating a stratigraphic layer cake
         and deform it by adding geological events.
      </v-col>
      <v-col>
        <v-row>
          <v-col>
            <v-btn x-small color="primary" class="mr-2" @click="historyToClipboard()">Import</v-btn>
            <v-btn x-small color="primary" @click="historyToClipboard()">Export</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar">
      Model copied to clipboard.
      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-expansion-panels :multiple="true" :hover="true" class="mt-10">
      <v-expansion-panel v-for="(_, eventIndex) in history" :key="eventIndex">
        <Event :eventIndex="eventIndex" />
        <DeleteEvent v-if="eventIndex > 0" :eventIndex="eventIndex" />
        <AddEvent :eventIndex="eventIndex" />
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
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
  computed: {
    ...mapState({
      history: state => state.history.events,
    })
  },
  data: () => ({
    drawer: false,
    snackbar: false,
  }),
  methods: {
    getHistory: function() {
      return JSON.stringify(this.$store.state.history.events, null, 4)
    },
    historyToClipboard: function() {
      let dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = this.getHistory();
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.snackbar = true;
    }
  }


};
</script>

<style scoped>
.textbox {

}
</style>
