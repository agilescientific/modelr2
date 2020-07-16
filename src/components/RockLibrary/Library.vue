<template>
  <div>
    <v-card-title class="text-capitalize">{{ libraryName }}</v-card-title>
    <v-card v-for="(rock, index) in library" :key="rock">
      <Rock :index="index" :libraryName="libraryName"></Rock>
    </v-card>
  </div>
</template>

<script>
  import Rock from "./Rock";
  export default {
    name: 'Library',
    components: {Rock},
    props: ['libraryName'],
    computed: {
      library() {
        return this.$store.state.rockLibrary.libraries[this.libraryName]
      }
    }
  }
</script>