<template>
  <v-speed-dial
    v-model="eventType"
    class="mr-12 speeddial"
    :open-on-hover="false"
    direction="left"
    :top="true"
    :right="true"
    absolute
    transition="slide-x-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
        color="grey lighten-3"
        class="elevation-0"
        fab
        x-small
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-btn
      v-for="event in Object.keys(events)" :key="event"
      small
      color="grey lighten-3"
      @click="insertEvent(event)"
    >
      {{ event }}
    </v-btn>

  </v-speed-dial>
</template>

<script>
export default {
  name: 'AddEvent',
  props: ['eventIndex'],
  data() {
    return {
      eventType: '',
      events: {
        fault: {
          type: "fault",
          parameters: {
            name: {value: "Fault"},
            X: {value: 2000 + Math.random() * 6000, uncertain: false},
            Y: {value: 0, uncertain: false},
            Z: {value: 6000, uncertain: false},
            dip: {value: 55 + Math.random() * 10, uncertain: false},
            dip_dir: {value: 270, uncertain: false},
            slip: {value: 200 + Math.random() * 400, uncertain: false}
          }
        },
        fault_curved: {
          type: 'fault',
          parameters: {
            name: {value: 'Curved Fault'},
            geometry: {value: 'Curved'},
            X: {value: 5000, uncertain: false},
            Y: {value: 0, uncertain: false},
            Z: {value: 5000, uncertain: false},
            dip: {value: 45, uncertain: false},
            dip_dir: {value: 270, uncertain: false},
            slip: {value: 400, uncertain: false},
            radius: {value: 2000, uncertain: false},
            xaxis: {value: 5000, uncertain: false},
            yaxis: {value: 5000, uncertain: false},
            zaxis: {value: 40000, uncertain: false},
            amplitude: {value: 1000, uncertain: false}
          }
        },
        unconformity: {
          type: 'unconformity',
          parameters: {
            name: {value: 'Unconformity'},
            X: {value: 5000, uncertain: false},
            Y: {value: 0, uncertain: false},
            Z: {value: 3000, uncertain: false},
            dip_direction: {value: 90, uncertain: false},
            dip: {value: 0, uncertain: false},
            num_layers: {value: 0, uncertain: false},
            layer_names: {value: [], uncertain: false},
            layer_thickness: {value: [], uncertain: false}
          }
        },
        tilt: {
          type: 'tilt',
          parameters: {
            name: {value: 'Tilt'},
            X: {value: 5000, uncertain: false},
            Y: {value: 0, uncertain: false},
            Z: {value: 3000, uncertain: false},
            rotation: {value: 0, uncertain: false},
            plunge_direction: {value: 0, uncertain: false},
            plunge: {value: 0, uncertain: false}
          }
        },
        fold: {
          type: "fold",
          parameters: {
            name: {value: "Fold"},
            X: {value: 2000 + Math.random() * 6000, uncertain: false},
            Y: {value: 0, uncertain: false},
            Z: {value: 6000, uncertain: false},
            amplitude: {value: 100, uncertain: false},
            wavelength: {value: 10000, uncertain: false},
            dip_dir: {value: 90, uncertain: false}
          }
        }
      },
    }
  },
  methods: {
    insertEvent(type) {
      this.$store.dispatch('history/updateEventInsert', {
        index: this.eventIndex,
        event: this.events[type]
      });
    }
  }
}
</script>

<style scoped>
.speeddial {
  margin-top: -9px;
  box-shadow: 0px 0px white;
}
</style>