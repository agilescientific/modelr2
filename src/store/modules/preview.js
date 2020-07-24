import axios from 'axios';
import {drawSection} from "../index";

const state = {
  section: undefined,
  direction: 'y',
  position: 'center',
  seed: 42,
  canvas: 'canvasPreview1',
  sectionShape: [200, 100],
  sectionCmap: 'viridis'
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
          22,
          false
        )
      }
    )
  },
  updatePreviews({dispatch}, {seeds, directions, canvases}) {
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
        'getSectionPlotSection'
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