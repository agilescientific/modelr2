import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

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
        plunge: 0
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
        plunge: 90

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

