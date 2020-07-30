<template>
  <div>
    <v-row>
      <v-col class="my-auto py-0" cols="4">
        <v-switch v-model="uncertain" dense label="Uncertain Event"></v-switch>
      </v-col>
      <v-col class="my-auto py-0 pt-5" cols="6">
        <v-slider :disabled="!uncertain" dense min="0" max="100" value="100" label="Probability of Occurence" thumb-label="always"></v-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="my-auto py-0" cols="4">
        <v-switch v-model="family" dense label="Probabilistic Event Family"></v-switch>
      </v-col>
      <v-col class="my-auto py-0 pt-5" cols="6">
        <v-range-slider :disabled="!family" dense min="0" max="10" v-model="nEvents" label="# of Events" thumb-label="always" ticks="always"></v-range-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>Parameter</v-col>
      <v-col class="">Uncertain</v-col>
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
        <Parameter :parameterName="name" :eventIndex="eventIndex" />
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
    data() {
      return {
        uncertain: false,
        family: false,
        nEvents: [1,3]
      }
    },
    computed: {
      ...mapGetters('history', ['getEvent'])
    }
  }
</script>

<style scoped>

</style>