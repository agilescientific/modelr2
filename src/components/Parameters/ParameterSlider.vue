<template>
  <div>
    <div v-if="Array.isArray(value)">
      <v-slider
        v-model="value[loc]"
        :min="extent[loc * 2]"
        :max="extent[(loc * 2) + 1]"
        :label="posLabel[loc]"
        @click="updateModel()"
        dense
        thumb-label
      ></v-slider>
    </div>
    <div v-else>
      <v-slider
        :min="min[parameterName]"
        :max="max[parameterName]"
        v-model="value"
        thumb-label
        dense
        @click="updateModel()"
        :label="parameterName"
        class="text-capitalize"
      ></v-slider>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Parameter',
  props: ['parameterName', 'eventIndex', 'loc'],
  methods: {
    updateModel() {
      let payload = {
        n: this.eventIndex,
        key: this.parameterName,
        value: this.value
      }
      this.$store.dispatch('history/updateEventParam', payload)
    }
  },
  computed: {
    posLabel() {
      return ["X", "Y", "Z"]
    },
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