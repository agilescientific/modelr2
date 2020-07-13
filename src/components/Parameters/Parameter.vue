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
        min="0"
        max="1000"
        v-model="value"
        :label="parameterName"
        class="text-capitalize"
      ></v-slider>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex';

export default {
  name: 'Parameter',
  props: ['parameterName', 'eventIndex'],
  computed: {
    extent() {
      return this.$store.state.modelExtent
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