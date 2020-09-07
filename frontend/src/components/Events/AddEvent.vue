<template>
  <v-speed-dial
    v-model="eventType"
    class="mr-12 speeddial"
    :open-on-hover="true"
    direction="top"
    :top="true"
    :right="true"
    absolute
    transition="slide-x-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
        color="grey lighten-3"
        class="elevation-0"
        small
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-btn
      v-for="event in Object.keys(events)" :key="event"
      small
      color="secondary"
      class="elevation-10"
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
          uncertain: false,
          probability: 0.9,
          event_family: false,
          nEvents: [1,3],
          parameters: {
            name: {value: "Fault"},
            X: {value: 2000 + Math.random() * 6000, uncertain: false},
            Y: {value: 5000, uncertain: false},
            Z: {value: 2500, uncertain: false},
            dip: {value: 55 + Math.random() * 10, uncertain: false},
            dip_dir: {value: 270, uncertain: false},
            slip: {value: 200 + Math.random() * 400, uncertain: false}
          }
        },
        fault_curved: {
          type: 'fault',
          uncertain: false,
          probability: 0.9,
          event_family: false,
          nEvents: [1,3],
          parameters: {
            name: {value: 'Curved Fault'},
            geometry: {value: 'Curved'},
            X: {value: 5000, uncertain: false},
            Y: {value: 5000, uncertain: false},
            Z: {value: 2500, uncertain: false},
            dip: {value: 45, uncertain: false},
            dip_dir: {value: 270, uncertain: false},
            slip: {value: 400, uncertain: false},
            xaxis: {value: 5000, uncertain: false},
            yaxis: {value: 5000, uncertain: false},
            zaxis: {value: 40000, uncertain: false},
            amplitude: {value: 1000, uncertain: false}
          }
        },
        unconformity: {
          type: 'unconformity',
          uncertain: false,
          probability: 0.9,
          event_family: false,
          nEvents: [1,3],
          parameters: {
            name: {value: 'Unconformity'},
            X: {value: 5000, uncertain: false},
            Y: {value: 5000, uncertain: false},
            Z: {value: 2500, uncertain: false},
            dip_direction: {value: 90, uncertain: false},
            dip: {value: 0, uncertain: false},
            num_layers: {value: 1, uncertain: true, distribution: 'uniform', low: 5, high: 10},
            layer_names: {value: ['Unconformity 1'], uncertain: false},
            layer_thickness: {value: [1], uncertain: true, distribution: 'uniform', low: 150, high: 250},
            lithology: {value: ['Sandstone'], uncertain: false}
          }
        },
        tilt: {
          type: 'tilt',
          uncertain: false,
          probability: 0.9,
          event_family: false,
          nEvents: [1,3],
          parameters: {
            name: {value: 'Tilt'},
            Y: {value: 5000, uncertain: false},
            X: {value: 5000, uncertain: false},
            Z: {value: 2500, uncertain: false},
            rotation: {value: 0, uncertain: false},
            plunge_direction: {value: 0, uncertain: false},
            plunge: {value: 0, uncertain: false}
          }
        },
        fold: {
          type: "fold",
          uncertain: false,
          probability: 0.9,
          event_family: false,
          nEvents: [1,3],
          parameters: {
            name: {value: "Fold"},
            X: {value: 5000, uncertain: false},
            Y: {value: 5000, uncertain: false},
            Z: {value: 2500, uncertain: false},
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
  margin-top: -6px;
  box-shadow: 0px 0px white;
}
</style>