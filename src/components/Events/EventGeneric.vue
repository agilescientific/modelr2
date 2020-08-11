<template>
  <div>
    <v-row>
      <v-col class="my-auto py-0" cols="4">
        <v-switch v-model="event.uncertain" dense label="Uncertain Event"></v-switch>
      </v-col>
      <v-col class="my-auto py-0 pt-5" cols="6">
        <v-slider
          :disabled="!event.uncertain"
          dense
          min="0" max="1"
          v-model="event.probability"
          @click="updateEventUncertainty()"
          step="0.05"
          label="Probability of Occurence"
          thumb-label="always">
        </v-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="my-auto py-0" cols="4">
        <v-switch v-model="event.event_family" dense label="Probabilistic Event Family"></v-switch>
      </v-col>
      <v-col class="my-auto py-0 pt-5" cols="6">
        <v-range-slider
          :disabled="!event.event_family"
          dense
          min="0" max="10"
          v-model="event.nEvents"
          label="# of Events"
          thumb-size="20"
          thumb-label="always"
          ticks="always">
        </v-range-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>Parameters and Uncertainty</v-col>
    </v-row>
    <div v-if="getEvent(eventIndex).type === 'unconformity'">
      <v-card flat>
        <RandomStratigraphyGenerator :eventIndex="eventIndex" />
      </v-card>
    </div>
    <div v-for="(_, name) in getEvent(eventIndex).parameters" :key="name">
      <div v-if="name === 'name'"></div>
      <div v-else-if="name === 'geometry'"></div>
      <div v-else-if="name === 'num_layers'"></div>
      <div v-else-if="name === 'layer_names'"></div>
      <div v-else-if="name === 'layer_thickness'"></div>
      <div v-else-if="name === 'lithology'"></div>
      <div v-else-if="name === 'lithologies'"></div>
      <div v-else>
        <v-divider></v-divider>
        <Parameter class="parameter" :parameterName="name" :eventIndex="eventIndex" />
      </div>
    </div>
  </div>
</template>

<script>
  import Parameter from "../Parameters/Parameter";
  import RandomStratigraphyGenerator from "@/components/RandomStratigraphyGenerator";
  import {mapGetters} from "vuex";
  export default {
    name: "EventGeneric",
    components: {Parameter, RandomStratigraphyGenerator},
    props: ['eventIndex'],
    computed: {
      ...mapGetters('history', ['getEvent']),
      event: {
        get() {
          return this.$store.state.history.events[this.eventIndex]
        },
        // set(event) {
        //   console.log("trololo")
        //   this.$store.commit('history/SET_EVENT', {i: this.eventIndex, event: event})
        // }
      },
    },
    methods: {
      updateEventUncertainty() {
        this.$store.commit('history/SET_EVENT', {i: this.eventIndex, event: this.event})

      }
    }
  }
</script>