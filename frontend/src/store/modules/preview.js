import axios from 'axios';
const scale = require('scale-color-perceptual')

const state = {
  section: undefined,
  direction: 'y',
  positionY: 0,
  positionX: 0,
  seed: 42,
  canvas: 'canvasPreview',
  loading: 0,
  plotPropertyColormap: "inferno",
  plotProperty: "density",
  plotPropertyBool: undefined,
}

const mutations = {
  UPDATE_SECTION (state, payload) {
    state.section = payload.section
  }
}

function prepareCanvas(canvasId, shape) {
  let canvasX = shape[0];
  let canvasY = shape[1];
  let canvas = document.getElementById(canvasId)
  canvas.width = 200;
  canvas.height = 100;
  let ctx = canvas.getContext("2d");
  let imageData = ctx.getImageData(0, 0, canvasX, canvasY);
  let buffer = new ArrayBuffer(imageData.data.length);
  let buffer8 = new Uint8ClampedArray(buffer);
  let data = new Uint32Array(buffer);
  return {ctx, buffer8, data, imageData}
}

const convertHexToRGBA = (hexCode, opacity) => {
  let hex = hexCode.replace('#', '');
  if (hex.length === 3) {
    hex += hex
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return {r: r, g: g, b: b, a: opacity / 100}
};

function getColors(rootState) {
  // Get colors of currently selected library
  let colors = {};
  rootState.rockLibrary.library.map(x => colors[x.name] = convertHexToRGBA(x.color, 100));
  return colors
}

const actions = {
  drawSection({rootState}, {canvas, section, shape, sampled_lith}) {
    let colors = {}
    if (rootState.preview.plotPropertyBool === true) {
      let propertyMap = {}
      rootState.rockLibrary.library.map(x => propertyMap[x.name] = x[rootState.preview.plotProperty])
      let properties = Object.values(propertyMap)
      let propertiesMax = Math.max(...properties)
      for (let [key, value] of Object.entries(propertyMap)) {
        let scaledValue = value / propertiesMax

        colors[key] = convertHexToRGBA(scale[rootState.preview.plotPropertyColormap](scaledValue))
        colors[key].a = 1
      }
    } else {
      colors = getColors(rootState);
    }
    let {ctx, buffer8, data, imageData} = prepareCanvas(canvas, shape);
    let layer_id = undefined;
    let color = undefined;
    for (let x = 0; x < shape[0]; x += 1) {
      for (let y = 0; y < shape[1]; y += 1) {
        layer_id = section[y][x]
        color = colors[sampled_lith[layer_id - 1]]
        data[y * shape[0] + x] =
          (color.a * 255 << 24) |    // alpha
          (color.b << 16) |          // blue
          (color.g <<  8) |          // green
           color.r;                  // red
      }
    }
    imageData.data.set(buffer8);
    ctx.putImageData(imageData, 0, 0);
  },

  getSectionPlotSection({state, dispatch, rootState}, {seed, direction, canvas}) {
    let position = undefined
    if (direction === "x") {
      position = state.positionX
    } else {
      position = state.positionY
    }
    let url = rootState.fastAPIurl + 'sample/' + seed + "/" + direction + "?position="+position
    axios.get(url).then((response) => {
      let section = response.data.section
      let shape = response.data.shape.reverse()
      let sampled_lith = response.data.lithologies
      dispatch('drawSection', {canvas, section, shape, sampled_lith})
      state.loading--
      if (state.loading <= 1) {
        state.loading = false
      }
    })
  },

  updatePreviews({state, dispatch}, {seeds, canvases}) {
    dispatch(
      'history/updateHistory', null, {root: true}
    ).then(() => {
      for (let i = 1; i < seeds.length; i += 1) {
        state.loading++;
        dispatch('getSectionPlotSection',
          {seed: seeds[i], direction: state.direction, canvas: canvases[i]}
        )
      }
    })
  },
  updatePreview({state, dispatch}) {
    dispatch(
      'history/updateHistory', null, {root: true}
    ).then(() => {
        dispatch('getSectionPlotSection',
          {seed: state.seed, direction: state.direction, canvas: 'canvasPreview'}
        )

    })
    // ).then(() => {
    //   dispatch('getSectionPlotSection',
    //       {seed: state.seed, direction: "x", canvas: 'canvasPreviewX'}
    //   )
    // })
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}