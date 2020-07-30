import axios from 'axios';
// import {drawSection} from "../index";

const state = {
  section: undefined,
  direction: 'y',
  position: 0,
  seed: 42,
  canvas: 'canvasPreview',
  sectionCmap: 'salinity',
  loading: 0,
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
  canvas.width = canvasX;
  canvas.height = canvasY;
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

const actions = {
  drawSection2({rootState}, {canvas, section, shape}) {
    let current = rootState.rockLibrary.currentLibrary;
    let colors = {};
    rootState.rockLibrary.libraries[current].map(x => colors[x.name] = convertHexToRGBA(x.color, 100));

    let lithologies = [];
    rootState.history.events.forEach((event) => {
      let liths = event.parameters.lithology
      if (liths !== undefined) {
        lithologies.push(...liths.value)
        console.log(liths.value)
      }
    })
    let {ctx, buffer8, data, imageData} = prepareCanvas(canvas, shape);
    let v = undefined;
    let c = undefined;
    for (let x = 0; x < shape[0]; x += 1) {
      for (let y = 0; y < shape[1]; y += 1) {
        v = section[y][x]
        // v is layer id in section array
        // have to link this back to layer
        // console.log(v)
        let lithology = lithologies[v - 1]

        c = colors[lithology]

        data[y * shape[0] + x] =
          (c.a * 255 << 24) |    // alpha
          (c.b<< 16) |          // blue
          (c.g <<  8) |          // green
           c.r;                  // red
      }
    }
    imageData.data.set(buffer8);
    ctx.putImageData(imageData, 0, 0);
  },
  getSectionPlotSection({state, dispatch, rootState}, {seed, direction, canvas}) {
    let url = rootState.fastAPIurl + 'sample/' + seed + "/" + direction + "?position="+state.position
    axios.get(url).then((response) => {
      // drawSection(
      //   canvas,
      //   response.data.section,
      //   response.data.shape.reverse(),
      //   state.sectionCmap,
      //   rootState.history.events[0].parameters.num_layers.value,
      //   false
      // )
      let section = response.data.section
      let shape = response.data.shape.reverse()
      dispatch('drawSection2', {canvas, section, shape})
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
        // state.loading++;
        dispatch('getSectionPlotSection',
          {seed: state.seed, direction: state.direction, canvas: 'canvasPreview'}
        )
    }
    )
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