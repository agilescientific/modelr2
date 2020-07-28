import axios from 'axios';
import {drawSection} from "../index";

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

const actions = {
  getSectionPlotSection({state, rootState}, {seed, direction, canvas}) {
    let url = rootState.fastAPIurl + 'sample/' + seed + "/" + direction + "?position="+state.position
    axios.get(url).then((response) => {
      drawSection(
        canvas,
        response.data.section,
        response.data.shape.reverse(),
        state.sectionCmap,
        rootState.history.events[0].parameters.num_layers.value,
        false
      )
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