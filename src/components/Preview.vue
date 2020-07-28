<template>
  <div>
    <v-card class="mx-auto">
      <v-card-title class="primary--text">Model Preview</v-card-title>
<!--      <v-card-subtitle>Live-updating model section.</v-card-subtitle>-->
      <v-card-text class="py-0">
        <v-row>
          <v-col cols="5">
            <canvas id="canvasPreview"></canvas>
          </v-col>
          <v-col>
            <v-select dense :items="sectionAxisOptions" v-model="direction" label="Section axis"></v-select>
            <v-slider
                @click="updatePreview()"
                dense
                v-model="position"
                :min="getExtent[0]"
                :max="getExtent[1]"
                label="Section position"
                thumb-label="always"
            ></v-slider>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title class="primary--text pt-0">Sample Preview</v-card-title>
      <v-card-subtitle>Preview stochastic model samples.</v-card-subtitle>
      <v-card-text class="my-0 py-0">
        <v-row>
          <v-col>
            <v-text-field
              dense
              v-model="seed"
              type="number"
              label="Random Seed"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-slider
              label="# Samples"
              min="1"
              max="12"
              v-model="previewNSamples"
              dense
              ticks="always"
              tick-size="3"
              thumb-label="always"
              :thumb-size="26"
            ></v-slider>
          </v-col>
          <v-col>
            <v-btn
              class="ml-4 primary"
              dense small @click="handlePreviews()"
            >
              <v-fade-transition>
                <v-progress-circular
                  v-show="loading"
                  indeterminate
                  color="white"
                  class="mr-2"
                  :size="15"
                ></v-progress-circular>
              </v-fade-transition>
              Sample
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="py-0">
        <v-row class="">
          <v-col v-for="i in previewNSamples" :key="i" cols="3">
            <canvas :id="'canvasPreview'+i"></canvas>
          </v-col>
        </v-row>
      </v-card-text>
<!--      <v-card>-->
<!--        <v-card-text>-->
<!--          <code>-->
<!--            {{ events }}-->
<!--          </code>-->
<!--        </v-card-text>-->
<!--      </v-card>-->
     </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {extent} from "@/main";

export default {
  name: 'Preview',
  data() {
    return {
      sectionAxisOptions: ['x', 'y'],
    }
  },
  computed: {
    getExtent: function() {
      if (this.direction === 'y') {
        return [extent[0], extent[1]]
      } else if (this.direction === 'x') {
        return [extent[2], extent[3]]
      } else{
        return undefined
      }
    },
    loading: function() {
      return this.$store.state.preview.loading
    },
    ...mapGetters({events: 'history/getEvents'}),
    seed: {
      get() {
        return this.$store.state.preview.seed
      },
      set(value) {
        this.$store.state.preview.seed = value
        this.updatePreview()
      }
    },
    direction: {
      get() {
        return this.$store.state.preview.direction
      },
      set(value) {
        this.$store.state.preview.direction = value
        this.updatePreview()
      }
    },
    position: {
      get() {
        return this.$store.state.preview.position
      },
      set(value) {
        this.$store.state.preview.position = value
      }
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
    previewNSamples: {
      get() {
          return this.$store.state.settings.previewNSamples
      },
      set(value) {
        this.$store.state.settings.previewNSamples = value
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
    handlePreviews: function() {
      let seeds = [];
      let canvases = [];
      for (let i = 0; i <= this.previewNSamples; i += 1) {
        seeds.push(Math.round(Math.random()*1000))
        canvases.push('canvasPreview'+i)
      }
      this.updatePreviews({seeds, canvases})
    }
    ,
    ...mapActions({
      updatePreview: 'preview/updatePreview',
      updatePreviews: 'preview/updatePreviews'
    })
  }
};
</script>

<style scoped>
  canvas {
    /*border: solid 1px red;*/
    width: 100%;
  }
</style>