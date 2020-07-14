<template>
  <div>
    <div v-if="parameterName === 'pos'">
      <v-row>
        <v-col>
          <v-slider
            :min="extent[0]"
            :max="extent[1]"
            v-model="value[0]"
            label="X"
          ></v-slider>
        </v-col>
        <v-col>
          <v-slider
            :min="extent[2]"
            :max="extent[3]"
            v-model="value[1]"
            label="Y"
          ></v-slider>
        </v-col>
        <v-col>
          <v-slider
            :min="extent[4]"
            :max="extent[5]"
            v-model="value[2]"
            label="Z"
          ></v-slider>
        </v-col>
      </v-row>      
    </div>
    <div v-else>
      <v-slider
        :min="min[parameterName]"
        :max="max[parameterName]"
        v-model="value"
        thumb-label
        :label="parameterName"
        class="text-capitalize"
      ></v-slider>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Parameter',
  props: ['parameterName', 'eventIndex'],
  computed: {
    extent() {
      return this.$store.state.modelExtent
    },
    min() {
      return {
        dip: 0,
        dip_dir: 0,
        slip: 0,
        amplitude: 0,
        wavelength: 0,
      }
    },
    max() {
      return {
        dip: 90,
        dip_dir: 360,
        slip: this.extent[5],
        amplitude: this.extent[5],
        wavelength: Math.max(...this.extent) * 5,
      }
    },
    value: {
      get() {
        return this.$store.state.history.events[this.eventIndex].parameters[this.parameterName]
      },
      set(value) {
        this.$store.commit('history/setEventParam', {
          n: this.eventIndex, key: this.parameterName, value: value
        })
      }
    }
  }
}
</script>