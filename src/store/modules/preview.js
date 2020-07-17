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