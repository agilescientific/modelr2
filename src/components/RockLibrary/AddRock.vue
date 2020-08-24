<template>
  <div>
    <v-form ref="form" class="text-right">
      <v-text-field
          label="Name"
          v-model="name"
          :rules="inputText"
      >
      </v-text-field>
      <v-text-field
          label="Density"
          v-model="density"
          :rules="inputNumber"
      >

      </v-text-field>
      <v-text-field
          label="Vp"
          v-model="vp"
          :rules="inputNumber"
      >

      </v-text-field>
      <div class="text-left grey--text text--darken-2">
        <span class="mr-4">Color</span>
        <v-btn @click="overlay = !overlay" class="mr-2 elevation-0" x-small :color="color"></v-btn>
      </div>

      <v-btn small color="primary" @click="submit()">Add to Library</v-btn>

    </v-form>
    <v-overlay
        :absolute="false"
        :value="overlay"
    >
      <v-color-picker v-model="color" light class="elevation-10"></v-color-picker>
      <v-btn @click="overlay = !overlay" light class="my-1 elevation-10">Close</v-btn>
    </v-overlay>
  </div>

</template>

<script>
export default {
  name: "AddRock",
  data() {
    return {
      name: undefined,
      density: undefined,
      vp: undefined,
      color: "#000000",
      overlay: false,
      inputText: [
        value => value.length >= 2 || 'Minimum length is 2 characters.'
      ],
      inputNumber: [
        value => value.match(/^[0-9]+$/) != null || 'Input needs to be a whole number.'
      ]
    }
  },
  methods: {
    submit() {
      // validation
      if (this.$refs.form.validate()) {
        this.$store.commit("rockLibrary/ADD_ROCK", {
          name: this.name,
          density: this.density,
          vp: this.vp,
          color: this.color,
        })
        this.name = undefined;
        this.density = undefined;
        this.vp = undefined;
      }
    }
  }
}
</script>

<style scoped>

</style>