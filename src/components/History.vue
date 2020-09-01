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
<!--            <v-btn x-small color="primary" class="mr-2" @click="importOverlay = !importOverlay">Import</v-btn>-->
            <v-dialog
                v-model="importOverlay"
                width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="green white--text"
                    x-small
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2"
                >
                  Import
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="headline grey lighten-2">
                  Paste Geomodel JSON
                </v-card-title>

                <v-textarea
                    class="mx-5"
                    placeholder="Paste Geomodel JSON here..."
                    v-model="importText"
                >

                </v-textarea>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      text
                      @click="importHistory()"
                  >
                    Load
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn x-small color="red white--text" @click="historyToClipboard()">Export</v-btn>
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

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

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
    importOverlay: false,
    importText: undefined,
  }),
  methods: {
    getHistory: function() {
      return JSON.stringify(this.$store.state.history.events, null, 4)
    },
    importHistory: function () {
      this.importOverlay = false;
      if (IsJsonString(this.importText) === true) {
        this.$store.state.history.events = JSON.parse(this.importText);
        this.importText = undefined;
      }
    },
    historyToClipboard: function () {
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
