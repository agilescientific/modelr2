<template>
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
      <v-btn small color="primary" @click="submit()">Add to Library</v-btn>
    </v-form>
</template>

<script>
export default {
  name: "AddRock",
  data() {
    return {
      name: undefined,
      density: undefined,
      vp: undefined,
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