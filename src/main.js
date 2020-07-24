import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

export const extent = [0, 10000, 0, 1000, 0, 5000]

Vue.mixin({
  computed: {
    extent() {
      return this.$store.state.modelExtent
    },
    minValues() {
      return {
        X: this.extent[0],
        Y: this.extent[2],
        Z: this.extent[4],
        dip: 0,
        dip_dir: 0,
        slip: 0,
        amplitude: 0,
        wavelength: 0,
        rotation: -90,
        plunge_direction: 0,
        plunge: 0,
        radius: 0,
        xaxis: 0,
        yaxis: 0,
        zaxis: 0
      }
    },
    maxValues() {
      return {
        X: this.extent[1],
        Y: this.extent[3],
        Z: this.extent[5],
        dip: 90,
        dip_dir: 360,
        slip: this.extent[5],
        amplitude: this.extent[5],
        wavelength: Math.max(...this.extent) * 5,
        rotation: 90,
        plunge_direction: 360,
        plunge: 90,
        radius: this.extent[1],
        xaxis: this.extent[1] * 3,
        yaxis: this.extent[3] * 5,
        zaxis: this.extent[5] * 10
      }
    }
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

