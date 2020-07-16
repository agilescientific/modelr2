<template>
  <v-card>
    <v-card-title>Rock Library</v-card-title>
    <v-card-subtitle>Choose a rock library, modify or add rock properties.</v-card-subtitle>
    <v-card-text>
      <v-card v-for="libraryName in Object.keys(libraries)" :key="libraryName">
        <Library :libraryName="libraryName"></Library>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
  import Library from '@/components/RockLibrary/Library.vue';

  export default {
    components: {
      Library,
    },
    computed: {
      libraries() {
        return this.$store.state.rockLibrary.libraries
      }
    }
  }
</script>