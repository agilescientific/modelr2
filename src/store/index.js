import Vue from 'vue'
import Vuex from 'vuex'
import history from './modules/history';
import settings from './modules/settings';
import axios from 'axios';

Vue.use(Vuex)

const backendPath = 'http://localhost:5000/';

export default new Vuex.Store({
  modules: {
    history: history,
    settings: settings
  },
  state: {
    modelExtent: [0, 10000, 0, 1000, 0, 5000],
    rockDensities: {
      'Sandstone': 2600,
      'Shale': 2450,
      'Coal': 1300,
    }
  },

  mutations: {
    setPreviewSection(state, payload) {
      state.previewSection = payload.section
    },
    setPreviewSeismic(state, payload) {
      state.previewSeismic = payload.seismic
    }
  },

  actions: {
    computeSection({commit, state, dispatch}) {
      axios({
        method: 'post',
        url: backendPath + 'history',
        data: {
          history: JSON.stringify(state.history.events)
        }
      }).then((response) => {
        commit(
          'setPreviewSection', 
          {section: response.data['model']}
        )
        dispatch('drawSection', {
          canvasId: 'plotCanvas',
          cmap: 'viridis',
          data: 'previewSection',
          shape: [400, 200]
        });
      })
      // dispatch('computeSeismic')
    },

    computeSeismic({commit, state, dispatch}) {
      axios({
        method: 'post',
        url: backendPath + 'seismic',
        data: {
          section: JSON.stringify(state.previewSection)
        }
      }).then((response) => {
        commit(
          'setPreviewSeismic',
          {seismic: response.data['seismic']}
        );
        dispatch('drawSeismicSection', {
          canvasId: 'plotSeismic',
          cmap: 'viridis',
          data: 'previewSeismic',
          shape: [400, 198]
        });
      })
    },

    drawSeismicSection({state}, payload) {
      var {ctx, buffer8, data, imageData} = prepareCanvas(payload)

      let colormap = require('colormap');
      let colors = colormap({
        colormap: 'jet',
        nshades: 255,
        format: 'rgba',
        alpha: 1
      })

      let section = state[payload.data];
      for (let x = 0; x < payload.shape[0]; x += 1) {
        for (let y = 0; y < payload.shape[1]; y += 1) {
          let v = Math.round(section[Math.floor(y/2)][Math.floor(x/2)] * 254)
          let c = colors[v];
          data[y * payload.shape[0] + x] =
              (c[3] * 255 << 24) |    // alpha
              (c[2] << 16) |          // blue
              (c[1] <<  8) |          // green
               c[0];                  // red
        }
      }
      imageData.data.set(buffer8);
      ctx.putImageData(imageData, 0, 0)
    },

    drawSection({state}, payload) {
      var {ctx, buffer8, data, imageData} = prepareCanvas(payload)

      let colormap = require('colormap');
      let colors = colormap({
        colormap: payload.cmap,  // TODO: get colormap from state
        nshades: 11, // TODO: get nlayers for cmap from state
        format: 'rgba',
        alpha: 1
      })
      let section = state[payload.data];
      for (let x = 0; x < payload.shape[0]; x += 1) {
        for (let y = 0; y < payload.shape[1]; y += 1) {
          let c = colors[section[Math.floor(y/2)][Math.floor(x/2)]];
          data[y * payload.shape[0] + x] =
            (c[3] * 255 << 24) |    // alpha
            (c[2] << 16) |          // blue
            (c[1] <<  8) |          // green
             c[0];                  // red
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

function prepareCanvas(payload) {
  var canvasX = payload.shape[0];
  var canvasY = payload.shape[1];
  var canvas = document.getElementById(payload.canvasId)
  canvas.width = canvasX;
  canvas.height = canvasY;
  var ctx = canvas.getContext("2d");
  var imageData = ctx.getImageData(0, 0, canvasX, canvasY);
  var buffer = new ArrayBuffer(imageData.data.length);
  var buffer8 = new Uint8ClampedArray(buffer);
  var data = new Uint32Array(buffer);
  return {ctx, buffer8, data, imageData}
}
