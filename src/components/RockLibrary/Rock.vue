<template>
  <div>
    <v-card-title>
      {{ rock.name }}
      <v-btn @click="overlay = !overlay" class="ml-2" :color="rock.color"></v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          Density {{ rock.density }}
          Color {{ rock.color }}
        </v-col>
        <v-col>
          <v-overlay
            :absolute="false"
            :value="overlay"
          >
          <v-color-picker v-model="rock.color"></v-color-picker>
            <v-btn @click="overlay = !overlay">Close</v-btn>
          </v-overlay>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
  export default {
    name: 'Rock',
    props: ['index', 'libraryName'],
    data() {
      return {
        overlay: false,
        type: 'rgba',
      }
    },
    computed: {
      // color: {
      //   get() {
      //     return this.$store.state.rockLibrary.libraries[this.libraryName][this.index].color
      //   },
      //   set(value) {
      //     console.log(value)
      //     if (value.rgba !== undefined) {
      //       this.$store.state.rockLibrary.libraries[this.libraryName][this.index].color = value.rgba
      //     } else {
      //       this.$store.state.rockLibrary.libraries[this.libraryName][this.index].color = value
      //     }
      //   }
      // },
      rock: {
        get() {
          return this.$store.state.rockLibrary.libraries[this.libraryName][this.index]
        },
        set(value) {
          this.$store.state.rockLibrary.libraries[this.libraryName][this.index] = value
        }
      }
    }
  }

</script>