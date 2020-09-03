<template>
  <v-container>
    <v-card-title class="">
      Model settings
    </v-card-title>
    <v-card-subtitle>Adjust global model settings, such as the model extent.</v-card-subtitle>
    <v-card class="elevation-0">
      <v-card-title class="grey--text text--darken-1">
        Extent
      </v-card-title>
      <v-card-subtitle>
        Model extent in meters.
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[0]" label="x" type="number"></v-text-field></v-col>
          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[1]" label="X" type="number"></v-text-field></v-col>
        </v-row>
        <v-row>
          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[2]" label="y" type="number"></v-text-field></v-col>
          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[3]" label="Y" type="number"></v-text-field></v-col>
        </v-row>
        <v-row>
          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[4]" label="z" type="number"></v-text-field></v-col>
          <v-col cols="2"><v-text-field dense class="extent" v-model="extent[5]" label="Z" type="number"></v-text-field></v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Settings",
  computed: {
    extent: {
      get() {
        return this.$store.state.history.extent
      },
      set(value) {
        this.$store.state.history.extent = value
        this.$store.dispatch('preview/updatePreview')
      }
    }
  }
}
</script>

<style scoped>

</style>