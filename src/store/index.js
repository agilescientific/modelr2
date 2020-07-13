import Vue from 'vue'
import Vuex from 'vuex'
import history from './modules/history';
import axios from 'axios';

Vue.use(Vuex)

const backendPath = 'http://localhost:5000/history';

export default new Vuex.Store({
  modules: {
    history: history
  },
  state: {
    previewAutoReload: true,
    modelExtent: [0, 10000, 0, 1000, 0, 5000]
  },
  mutations: {
    setPreviewSection(state, payload) {
      state.previewSection = payload.section
    }
  },
  actions: {
    computeSection({commit, state, dispatch}) {
      axios({
        method: 'post',
        url: backendPath,
        data: {
          history: JSON.stringify(state.history.events)
        }
      }).then((response) => {
        commit(
          'setPreviewSection', 
          {section: response.data['model']}
        );
        dispatch('drawSection');
      })
    },
    drawSection({state}) {
      var canvasX = 200;
      var canvasY = 100;
      var canvas = document.getElementById("plotCanvas")
      canvas.width = canvasX;
      canvas.height = canvasY;
      var ctx = canvas.getContext("2d");
      var imageData = ctx.getImageData(0, 0, canvasX, canvasY);
      var buffer = new ArrayBuffer(imageData.data.length);
      var buffer8 = new Uint8ClampedArray(buffer);
      var data = new Uint32Array(buffer);
      let colormap = require('colormap');
      let colors = colormap({
        colormap: 'viridis',  // TODO: get colormap from state
        nshades: 11, // TODO: get nlayers for cmap from state
        format: 'rgba',
        alpha: 1
      })
      let section = state.previewSection;
      for (let x = 0; x < canvasX; x += 1) {
        for (let y = 0; y < canvasY; y += 1) {
          let c = colors[section[y][x]];
          let value = 
            (c[3] * 255 << 24) |    // alpha
            (c[2] << 16) |          // blue
            (c[1] <<  8) |          // green
             c[0];                  // red
          data[y * canvasX + x] = value
        }
      }
      imageData.data.set(buffer8);
      ctx.putImageData(imageData, 0, 0)
    },
    async refreshPreview({dispatch}) {
      await dispatch('computeSection')
      dispatch('drawSection')
    }
  }
})
