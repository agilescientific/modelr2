<template>
  <v-card width="600px">
    <v-card-title>Rock Library</v-card-title>
    <v-card-subtitle>Choose a rock library, modify or add rock properties.</v-card-subtitle>
    <v-card-text>
      <v-select :items="Object.keys(libraries)" v-model="selectedLibrary" label="Rock Library"></v-select>
      <div
          v-for="(rock, index) in libraries[selectedLibrary]" :key="index"
          class="elevation-0"
      >
        <Rock :index="index" :libraryName="selectedLibrary" />
        <!--      <v-divider class="my-2"></v-divider>-->
      </div>
<!--      <Library :libraryName="selectedLibrary"></Library>-->
    </v-card-text>
  </v-card>
</template>

<script>
  import Rock from '@/components/RockLibrary/Rock.vue';

  export default {
    components: {
      Rock,
    },
    data() {
      return {
        selectedLibrary: 'Mars'
      }
    },
    computed: {
      libraries() {
        return this.$store.state.rockLibrary.libraries
      }
    }
  }
</script>