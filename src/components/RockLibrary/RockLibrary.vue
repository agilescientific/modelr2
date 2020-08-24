<template>
  <v-container  class="mt-5">
    <v-row>
      <v-col class="font-weight-light text-body-1 pl-10 pr-10" cols="8">
        Select a rock library, add, remove and edit rocks. Add new custom properties to all rocks
        to populate your models.
      </v-col>
      <v-col>
        <v-row>
          <v-col>
            <v-btn x-small color="primary" class="mr-2" @click="historyToClipboard()">Import</v-btn>
            <v-btn x-small color="primary" @click="historyToClipboard()">Export</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-container class="mt-10">
      <v-select :items="Object.keys(libraries)" v-model="selectedLibrary" label="Rock Library"></v-select>
    </v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header  class="grey lighten-3">Add Rock</v-expansion-panel-header>
        <v-expansion-panel-content>
          <AddRock />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-text>
      <div
          v-for="(rock, index) in libraries[selectedLibrary]" :key="index"
          class="elevation-0"
      >
        <Rock :index="index" :libraryName="selectedLibrary" />
      </div>
    </v-card-text>
  </v-container>
</template>

<script>
  import Rock from '@/components/RockLibrary/Rock.vue';
  import { validationMixin } from 'vuelidate';
  import { required } from 'vuelidate/lib/validators';
  import AddRock from "@/components/RockLibrary/AddRock";

  export default {
    mixins: [validationMixin],
    components: {
      AddRock,
      Rock,
    },
    data() {
      return {
        selectedLibrary: 'North Sea'
      }
    },
    computed: {
      libraries() {
        return this.$store.state.rockLibrary.libraries
      },
      nameErrors() {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.select.required && errors.push('Name is required.')
        return errors
      }
    },
    methods: {
      addRock() {
        this.$v.$touch()
      }
    },
    validations: {
      name: { required }
    }
  }
</script>