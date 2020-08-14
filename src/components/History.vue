<template>
  <v-container>
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
<!--      <v-card-title class="primary&#45;&#45;text">-->
<!--        Model settings-->
<!--      </v-card-title>-->
<!--      <v-card-text>-->
<!--        Model extent in meters.-->
<!--        <v-row>-->
<!--          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[0]" label="x" type="number"></v-text-field></v-col>-->
<!--          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[1]" label="X" type="number"></v-text-field></v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[2]" label="y" type="number"></v-text-field></v-col>-->
<!--          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[3]" label="Y" type="number"></v-text-field></v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[4]" label="z" type="number"></v-text-field></v-col>-->
<!--          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[5]" label="Z" type="number"></v-text-field></v-col>-->
<!--        </v-row>-->
<!--      </v-card-text>-->
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
    }),
    extent: {
      get() {
        return this.$store.state.history.extent
      },
      set(value) {
        this.$store.state.history.extent = value
        this.$store.dispatch('preview/updatePreview')
      }
    }
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
