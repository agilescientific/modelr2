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
    },
    previewSection: undefined,
    previewSeismic: undefined,
  },

  mutations: {
    setParameter(state, payload) {
      state[payload.parameter] = payload.value
    }
  },

  actions: {
    computeSection({commit, state, dispatch}) {
      axios({
        method: 'post',
        url: backendPath + 'compute/' + state.settings.previewNSamples,
        data: {
          history: JSON.stringify(state.history.events),
          computeSeismic: JSON.stringify(true)
        }
      }).then((response) => {
        commit(
          'setParameter',
          {
            parameter: 'previewSection',
            value: response.data['sections']
          }
        )
        commit(
          'setParameter',
          {
            parameter: 'previewSeismic',
            value: response.data['seismics']
          }
        )
        for (let i = 0; i < state.settings.previewNSamples; i += 1) {
          dispatch('drawSection', {
            index: i,
            canvasId: 'plotCanvas'+(i+1),
            cmap: 'viridis',
            data: 'previewSection',
            shape: [200, 100]
          });
          dispatch('drawSeismicSection', {
            index: i,
            canvasId: 'plotSeismic'+(i+1),
            cmap: 'greys',
            data: 'previewSeismic',
            shape: [200, 99]
          })
        }
      })
    },

    drawSeismicSection({state}, payload) {
      let {ctx, buffer8, data, imageData} = prepareCanvas(payload)

      let colormap = require('colormap');
      let colors = colormap({
        colormap: payload.cmap,
        nshades: 255,
        format: 'rgba',
        alpha: 1
      })

      let section = state[payload.data][payload.index];
      for (let x = 0; x < payload.shape[0]; x += 1) {
        for (let y = 0; y < payload.shape[1]; y += 1) {
          let v = Math.round(section[y][x] * 254)
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
      let {ctx, buffer8, data, imageData} = prepareCanvas(payload)

      let colormap = require('colormap');
      let colors = colormap({
        colormap: payload.cmap,  // TODO: get colormap from state
        nshades: 19, // TODO: get nlayers for cmap from state
        format: 'rgba',
        alpha: 1
      })
      console.log(state[payload.data])
      let section = state[payload.data][payload.index];
      for (let x = 0; x < payload.shape[0]; x += 1) {
        for (let y = 0; y < payload.shape[1]; y += 1) {
          let c = colors[section[y][x]];
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
  let canvasX = payload.shape[0];
  let canvasY = payload.shape[1];
  let canvas = document.getElementById(payload.canvasId)
  canvas.width = canvasX;
  canvas.height = canvasY;
  let ctx = canvas.getContext("2d");
  let imageData = ctx.getImageData(0, 0, canvasX, canvasY);
  let buffer = new ArrayBuffer(imageData.data.length);
  let buffer8 = new Uint8ClampedArray(buffer);
  let data = new Uint32Array(buffer);
  return {ctx, buffer8, data, imageData}
}
