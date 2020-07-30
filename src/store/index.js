import Vue from 'vue'
import Vuex from 'vuex'
import history from './modules/history';
import settings from './modules/settings';
import rockLibrary from './modules/rockLibrary';
import preview from './modules/preview';
import axios from 'axios';

Vue.use(Vuex)

// const backendPath = 'http://localhost:5000/';
const fastAPI = 'http://localhost:8000/';

export default new Vuex.Store({
  modules: {
    history: history,
    settings: settings,
    rockLibrary: rockLibrary,
    preview: preview,
  },
  state: {
    modelExtent: [0, 10000, 0, 1000, 0, 5000],
    previewSection: undefined,
    previewSeismic: undefined,
    fastAPIurl: 'http://localhost:8000/',
  },

  mutations: {
    setParameter(state, payload) {
      state[payload.parameter] = payload.value
    }
  },

  actions: {
    getSection({commit}, payload) {
      axios({
        method: 'get',
        url: fastAPI + 'sample/'+payload.seed+'/y'
      }).then((response) => {
        commit('setParameter', {
          parameter: 'previewSection',
          value: response.data['section']
        })
      })
    },
  }
})

function prepareCanvas(canvasId, shape) {
  let canvasX = shape[0];
  let canvasY = shape[1];
  let canvas = document.getElementById(canvasId)
  canvas.width = canvasX;
  canvas.height = canvasY;
  let ctx = canvas.getContext("2d");
  let imageData = ctx.getImageData(0, 0, canvasX, canvasY);
  let buffer = new ArrayBuffer(imageData.data.length);
  let buffer8 = new Uint8ClampedArray(buffer);
  let data = new Uint32Array(buffer);
  return {ctx, buffer8, data, imageData}
}

export function drawSection(canvasId, section, shape, cmap, ncolors, norm) {
  let {ctx, buffer8, data, imageData} = prepareCanvas(canvasId, shape)

  let colormap = require('colormap');
  let colors = colormap({
    colormap: cmap,  // TODO: get colormap from state
    nshades: ncolors * 2, // TODO: get nlayers for cmap from state
    format: 'rgba',
    alpha: 1
  })
  for (let x = 0; x < shape[0]; x += 1) {
    for (let y = 0; y < shape[1]; y += 1) {
      let v = undefined;
      if (norm === true) {
        v = Math.round(section[y][x] * 254)
      } else {
        v = section[y][x]
      }
      let c = colors[v];
      data[y * shape[0] + x] =
        (c[3] * 255 << 24) |    // alpha
        (c[2] << 16) |          // blue
        (c[1] <<  8) |          // green
        c[0];                  // red
    }
  }
  imageData.data.set(buffer8);
  ctx.putImageData(imageData, 0, 0)
}