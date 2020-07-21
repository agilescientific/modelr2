<template>
  <div>
    <v-row>
      <v-col>Parameter</v-col>
      <v-col class="">Uncertain</v-col>
    </v-row>
    <div v-for="(_, name) in getEvent(eventIndex).parameters" :key="name">
      <div v-if="name === 'name'"></div>
      <div v-else>
        <Parameter :parameterName="name" :eventIndex="eventIndex" />
      </div>
    </div>
  </div>
</template>

<script>
  import Parameter from "../Parameters/Parameter";
  import {mapGetters} from "vuex";
  export default {
    name: "EventGeneric",
    components: {Parameter},
    props: ['eventIndex'],
    computed: {
      ...mapGetters('history', ['getEvent'])
    }
  }
</script>

<style scoped>

</style>