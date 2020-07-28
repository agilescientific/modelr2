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
  loading: 0,
}

const mutations = {
  UPDATE_SECTION (state, payload) {
    state.section = payload.section
  }
}

const actions = {
  getSectionPlotSection({state, rootState}, {seed, direction, canvas}) {
    let url = rootState.fastAPIurl + 'sample/' + seed + "/" + direction;
    // console.log(url)
    axios.get(url).then((response) => {
      console.log(response)
      drawSection(
        canvas,
        response.data.section,
        state.sectionShape,
        state.sectionCmap,
        rootState.history.events[0].parameters.num_layers.value,
        false
      )
      state.loading--
      if (state.loading === 1) {
        state.loading = false
      }
    })
  },
  updatePreviews({state, dispatch}, {seeds, directions, canvases}) {
    dispatch(
      'history/updateHistory', null, {root: true}
    ).then(() => {
      for (let i = 1; i < seeds.length; i += 1) {
        state.loading++;
        dispatch('getSectionPlotSection',
          {seed: seeds[i], direction: directions[i], canvas: canvases[i]}
        )
      }
    })
  },
  updatePreview({state, dispatch}) {
    dispatch(
      'history/updateHistory', null, {root: true}
    ).then(() => {
        dispatch('getSectionPlotSection',
          {seed: state.seeds, direction: state.direction, canvas: 'canvasPreview'}
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