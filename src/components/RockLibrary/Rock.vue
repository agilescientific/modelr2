<template>
  <div>
    <v-card-title>{{ rock.name }}</v-card-title>
    <v-card-text>{{ rock.density }}</v-card-text>
  </div>
</template>

<script>
  export default {
    name: 'Rock',
    props: ['index', 'libraryName'],
    computed: {
      rock() {
        return this.$store.state.rockLibrary.libraries[this.libraryName][this.index]
      }
    }
  }

</script>