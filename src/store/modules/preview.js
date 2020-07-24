import axios from 'axios';
import {drawSection} from "../index";

const state = {
  section: undefined,
  direction: 'y',
  position: 'center',
  seed: 42,
  canvas: 'canvasPreview',
  sectionShape: [200, 100],
  sectionCmap: 'salinity',
  loading: false,
}

const mutations = {
  UPDATE_SECTION (state, payload) {
    state.section = payload.section
  }
}

const actions = {
  getSectionPlotSection({state, rootState}, {seed, direction, canvas}) {
    axios.get(
      rootState.fastAPIurl + 'sample/' + seed + "/" + direction
    ).then((response) => {
      let section = response.data.section

      drawSection(
        canvas,
        section,
        [200, 100],
        state.sectionCmap,
        rootState.history.events[0].parameters.num_layers.value,
        false
      )
    })
  },

  getPreviewSection({state, commit, rootState}) {
    axios.get(
      rootState.fastAPIurl + 'sample/' + state.seed + "/" + state.direction
    ).then((response) => {
        commit('UPDATE_SECTION', {section: response.data.section})
        drawSection(
          state.canvas,
          state.section,
          state.sectionShape,
          state.sectionCmap,
          rootState.history.events[0].parameters.num_layers.value,
          false
        )
      }
    )
  },
  updatePreviews({state, dispatch}, {seeds, directions, canvases}) {
    state.loading = true;
    // let remaining = seeds.length;
    dispatch(
      'history/updateHistory', null, {root: true}
    ).then(() => {
      for (let i = 0; i < seeds.length; i += 1) {
        dispatch('getSectionPlotSection',
          {seed: seeds[i], direction: directions[i], canvas: canvases[i]}
          )
      }
    })
  },
  updatePreview({dispatch}) {
    dispatch(
      'history/updateHistory', null, {root: true}
    ).then(() => {
      dispatch(
        'getPreviewSection'
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