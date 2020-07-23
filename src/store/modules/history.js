import axios from "axios";

const state = {
  events: [
    {
      type: "stratigraphy",
      parameters: {
        num_layers: {value: 18},
        layer_names: {
          value: [
            'layer 1', 'layer 2', 'layer 3',
            'layer 4', 'layer 5', 'layer 6',
            'layer 7', 'layer 8', 'layer 9',
            'layer 10', 'layer 11', 'layer 12',
            'layer 13', 'layer 14', 'layer 15',
            'layer 16', 'layer 17', 'layer 18'
          ]
        },
        layer_thickness: {
          value: [
            2500, 150, 150, 150, 150, 150, 150,
            150, 150, 150, 150, 150, 150, 150,
            150, 150, 150, 150, 150
          ]
        },
      }
    },
    {
      type: "fault",
      parameters: {
        name: {value: "Fault C"},
        X: {
          value: 6000,
          uncertain: false
        },
        Y: {
          value: 0,
          uncertain: false
        },
        Z: {
          value: 4000,
          uncertain: false
        },
        dip: {
          value: 60,
          uncertain: true,
          distribution: 'norm',
          scale: 10,
          skew: 2
        },
        dip_dir: {
          value: 270,
          uncertain: false
        },
        slip: {
          value: 750,
          uncertain: true,
          distribution: 'norm',
          scale: 60,
          skew: 0
        }
      }
    },
  ]
};
  
  const getters = {
    getEvent: (state) => (i) => state.events[i],
    getEvents: (state) => state.events,
    getParameter: (state) => (i, name) => state.events[i].parameters[name],
    getParameterValue: (state) => (i, name, key) => state.events[i].parameters[name][key],
  };
  
  const actions = {
    updateHistory({state, rootState}) {
      return axios.post(rootState.fastAPIurl + 'history', {
        history: JSON.stringify(state.events)
      })
    },
    updateEventParam({commit, dispatch, rootState}, payload) {
      commit('SET_EVENT_VALUE', payload)
      if (rootState.settings.previewAutoReload) {
        dispatch('preview/updatePreview', null, { root: true })
      }
    },
    updateEventInsert({commit, dispatch, rootState}, payload) {
      commit('INSERT_EVENT', payload)
      if (rootState.settings.previewAutoReload) {
        dispatch('preview/updatePreview', null, { root: true })
      }
    },
    updateEventDelete({commit, dispatch, rootState}, payload) {
      commit('DELETE_EVENT', payload)
      if (rootState.settings.previewAutoReload) {
        dispatch('preview/updatePreview', null, { root: true })
      }
    }
  };
  
  const mutations = {
    INSERT_EVENT: (state, payload) => {
      state.events.splice(payload.index + 1, 0, payload.event)
    },
    DELETE_EVENT: (state, payload) => {
      state.events.splice(payload.index, 1)
    },
    SET_EVENT_VALUE: (state, payload) => {
      state.events[payload.eventIndex].parameters[payload.parameterName][payload.key] = payload.value
    },
    TOGGLE_STOCHASTIC: (state, {value, eventIndex, parameterName}) => {
      if (value === true) {
        state.events[eventIndex].parameters[parameterName].uncertain = true
        state.events[eventIndex].parameters[parameterName].distribution = 'norm'
        state.events[eventIndex].parameters[parameterName].scale = state.events[eventIndex].parameters[parameterName].value
      } else {
        state.events[eventIndex].parameters[parameterName].uncertain = false
        delete state.events[eventIndex].parameters[parameterName].distribution
        delete state.events[eventIndex].parameters[parameterName].scale
      }
    }
  };
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };