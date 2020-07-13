<template>
  <div>
    <v-card
    class="mx-auto"
  >
    <v-card-title class="primary--text">Model Preview</v-card-title>
    <v-card-subtitle>Preview model samples.</v-card-subtitle>
    <v-card flat class="ml-4">
      <canvas id="plotCanvas"></canvas>
    </v-card>
          

      
    <v-card-title>History Object</v-card-title>
    
    <v-card class="mx-4 pa-2">
      <code>
      {{ events }}
      </code>
    </v-card>
   
    <div class="d-flex flex-row align-center">
      <v-btn class="ml-4" small @click="computeSection()">Recompute</v-btn>
      <v-switch class="ml-3" label="Auto-Update"></v-switch>
    </div>
     </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { mapActions } from 'vuex';

export default {
  name: 'Preview',
  data() {
    return {
      section: []
    }
  },
  computed: {
    ...mapState({
      events: state => state.history.events
    })
  },
  methods: {
    ...mapActions([
      'computeSection',
    ])
  }
};
</script>