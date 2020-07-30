<template>
  <div>
    <v-card class="mx-auto">
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
  }


};
</script>

<style scoped>
.extent {
  margin: 0;
}
</style>
