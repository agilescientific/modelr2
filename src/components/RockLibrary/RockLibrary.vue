<template>
  <v-container  class="mt-5">
    <v-row class="mb-10">
      <v-col class="font-weight-light text-body-1 pl-10 pr-10" cols="8">
        Select a rock library, add, remove and edit rocks. Add new custom properties to all rocks
        to populate your models.
      </v-col>
      <v-col>
        <v-row>
          <v-col>
            <v-dialog
                v-model="importOverlay"
                width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="green white--text"
                    x-small
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2"
                >
                  Import
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2">
                  Paste Geomodel JSON
                </v-card-title>

                <v-textarea
                    class="mx-5"
                    placeholder="Paste Geomodel JSON here..."
                    v-model="importText"
                >

                </v-textarea>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      text
                      @click="importLibrary()"
                  >
                    Load
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn x-small color="red white--text" @click="libraryToClipboard()">Export</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar">
      Rock library copied to clipboard.
      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header  class="grey lighten-3">Add Rock</v-expansion-panel-header>
        <v-expansion-panel-content>
          <AddRock />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-text class="mt-5">
      <div
          v-for="(rock, index) in library" :key="index"
          class="elevation-0"
      >
        <Rock :index="index" />
      </div>
    </v-card-text>
  </v-container>
</template>

<script>
  import Rock from '@/components/RockLibrary/Rock.vue';
  import { validationMixin } from 'vuelidate';
  import { required } from 'vuelidate/lib/validators';
  import AddRock from "@/components/RockLibrary/AddRock";

  function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  export default {
    mixins: [validationMixin],
    components: {
      AddRock,
      Rock,
    },
    data() {
      return {
        selectedLibrary: 'North Sea',
        snackbar: false,
        importOverlay: false,
        importText: undefined,
      }
    },
    computed: {
      library() {
        return this.$store.state.rockLibrary.library
      },
    },
    methods: {
      importLibrary: function () {
        this.importOverlay = false;
        if (IsJsonString(this.importText) === true) {
          this.$store.state.rockLibrary.library = JSON.parse(this.importText);
          this.importText = undefined;
        }
      },
      libraryToClipboard: function() {
        console.log("lel")
        let dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = JSON.stringify(this.$store.state.rockLibrary.library);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        this.snackbar = true;
      }
    },
    validations: {
      name: { required }
    }
  }
</script>