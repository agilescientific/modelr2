<template>
  <div>
    <v-divider></v-divider>
    <v-row class="text-sm-subtitle-2 my-3">
      <v-col>
        <v-btn @click="overlay = !overlay" class="mr-2 elevation-0" x-small :color="rock.color"></v-btn>
        {{ rock.name }}
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="1">
        <v-btn
            color="white red--text text--lighten-3"
            class="elevation-0"
            x-small
            @click="deleteRock()"
        >
          <v-icon>mdi-delete-forever</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col v-for="(_, property) in rock" :key="property" class="mx-2">
        <RockProperty
          v-if="property !== 'name' && property !== 'color'"
          :index="index"
          :property="property"
        />
      </v-col>
    </v-row>

    <v-overlay
        :absolute="false"
        :value="overlay"
        class="text-right"
    >
      <v-color-picker v-model="rock.color" light class="elevation-10"></v-color-picker>
      <v-btn @click="overlay = !overlay" small light class="my-1 elevation-10">Close</v-btn>
    </v-overlay>
  </div>
</template>

<script>
  import RockProperty from "@/components/RockLibrary/RockProperty";
  export default {
    name: 'Rock',
    components: {RockProperty},
    props: ['index'],
    data() {
      return {
        overlay: false,
        type: 'rgba',
      }
    },
    computed: {
      rock: {
        get() {
          return this.$store.state.rockLibrary.library[this.index]
        },
        set(value) {
          this.$store.state.rockLibrary.library[this.index] = value
        }
      },
      rockCss() {
        return {'background-color': this.rock.color}
      }
    },
    methods: {
      deleteRock() {
        this.$store.commit("rockLibrary/DELETE_ROCK", {index: this.index})
      }
    }
  }

</script>