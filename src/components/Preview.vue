<template>
  <div>
    <v-card class="mx-auto">
      <v-card-title class="primary--text">Model Preview</v-card-title>
      <v-card-subtitle>Preview model samples.</v-card-subtitle>
      <v-card flat class="ml-4">
        <canvas id="plotCanvas"></canvas>
      </v-card>
      <v-card flat class="ml-4">
        <canvas id="plotSeismic"></canvas>
      </v-card>  
      <div class="d-flex flex-row align-center">
        <v-btn class="ml-4" small @click="computeSection()">Recompute</v-btn>
        <v-switch v-model="previewAutoReload" class="ml-3" label="Auto-Update"></v-switch>
        <v-switch v-model="previewSeismic" class="ml-3" label="Seismic FM"></v-switch>
      </div>

      <v-card-title>History Object</v-card-title>
      <v-card class="mx-4 pa-2">
        <code>
          {{ events }}
        </code>
      </v-card>

      <v-card-title>Settings</v-card-title>
      <v-card class="mx-4 pa-2">
        <code>
          {{ settings }}
        </code>
      </v-card>
     </v-card>
     
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Preview',
  data() {
    return {
      section: []
    }
  },
  computed: {
    events() {
      return this.$store.state.history.events
    },
    settings() {
      return this.$store.state.settings
    },
    previewSeismic: {
      get() {
        return this.$store.state.settings.previewSeismic
      },
      set(value) {
        this.$store.state.settings.previewSeismic = value
      }
    },
    previewAutoReload: {
      get() {
        return this.$store.state.settings.previewAutoReload
      },
      set(value) {
        this.$store.state.settings.previewAutoReload = value
      }
    }
  },
  methods: {
    ...mapActions([
      'computeSection',
    ])
  }
};
</script>