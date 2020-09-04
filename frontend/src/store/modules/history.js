import axios from "axios";
import Vue from 'vue';
const extent = [0, 10000, 0, 1000, 0, 5000]

const state = {
  extent: [0, 10000, 0, 10000, 0, 5000],
  events: [
    {
    type: "stratigraphy",
      parameters: {
        num_layers: {
          value: 1,
          uncertain: true,
        },
        layer_names: {
          value: [
            'Layer 1'
          ],
        },
        layer_thickness: {
          value: [2500],
          uncertain: true,
          distribution: 'uniform',
          low: 150,
          high: 275,
        },
        lithology: {
          value: [
            'Sandstone'
          ],
        }
      }
    },
  ],
  minValues: {
    X: extent[0],
    Y: extent[2],
    Z: extent[4],
    dip: 0,
    dip_dir: 0,
    slip: 0,
    amplitude: 0,
    wavelength: 0,
    rotation: -90,
    plunge_direction: 0,
    plunge: 0,
    radius: 0,
    xaxis: 0,
    yaxis: 0,
    zaxis: 0
  },
  maxValues: {
    X: extent[1],
    Y: extent[3],
    Z: extent[5],
    dip: 90,
    dip_dir: 360,
    slip: extent[5],
    amplitude: extent[5],
    wavelength: Math.max(...extent) * 5,
    rotation: 90,
    plunge_direction: 360,
    plunge: 90,
    radius: extent[1],
    xaxis: extent[1] * 3,
    yaxis: extent[3] * 5,
    zaxis: extent[5] * 10
  }
};
  
  const getters = {
    getEvent: (state) => (i) => state.events[i],
    getEvents: (state) => state.events,
    getParameter: (state) => (i, name) => state.events[i].parameters[name],
    getParameterValue: (state) => (i, name, key) => state.events[i].parameters[name][key],
  };
  
  const actions = {
    updateHistory({state, rootState}) {
      // console.log(rootState.fastAPIurl + 'history')
      return axios.post(rootState.fastAPIurl + 'history', {
        history: JSON.stringify(state.events),
        rock_library: JSON.stringify(rootState.rockLibrary.library),
        extent: {
          x: state.extent[0], X: state.extent[1],
          y: state.extent[2], Y: state.extent[3],
          z: state.extent[4], Z: state.extent[5]
        }
      })
    },
    updateEvent({commit, dispatch, rootState}, payload) {
      commit('SET_EVENT', payload)
      if (rootState.settings.previewAutoReload) {
        dispatch('preview/updatePreview', null, { root: true })
      }
    },
    updateEventParameters({commit, dispatch, rootState}, payload) {
      commit('SET_EVENT_PARAMS', payload)
      if (rootState.settings.previewAutoReload) {
        dispatch('preview/updatePreview', null, { root: true })
      }
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
    },
    updateLayerDelete({commit, dispatch, rootState}, payload) {
      commit('DELETE_LAYER', payload)
      if (rootState.settings.previewAutoReload) {
        dispatch('preview/updatePreview', null, { root: true })
      }
    },
    updateLayerAdd({commit, dispatch, rootState}, payload) {
      commit('ADD_LAYER', payload)
      if (rootState.settings.previewAutoReload) {
        dispatch('preview/updatePreview', null, { root: true })
      }
    }
  };
  
  const mutations = {
    INSERT_EVENT: (state, payload) => {
      state.events.splice(payload.index + 1, 0, payload.event);
    },
    DELETE_EVENT: (state, payload) => {
      state.events.splice(payload.index, 1);
    },
    SET_EVENT: (state, payload) => {
      Vue.set(state.events, payload.i, payload.event)
      // state.events[payload.i] = payload.event;
    },
    SET_EVENT_PARAMS: (state, {i, parameters}) => {
      state.events[i].parameters = parameters;
    },
    SET_EVENT_PARAM: (state, {i, p, value}) => {
      // Overwrite the entire event parameter object
      state.events[i].parameters[p] = value;
    },
    SET_EVENT_VALUE: (state, {i, p, key, value}) => {
      // Overwrite the value of a specific parameter setting
      // state.events[i].parameters[p][key] = value;
      Vue.set(state.events[i].parameters[p], key, value)
    },
    TOGGLE_STOCHASTIC: (state, {value, eventIndex, parameterName}) => {
      // Toggles stochastic properties for given event parameter
      let param = state.events[eventIndex].parameters[parameterName];

      if (value === true) {
        param.uncertain = true;
        param.distribution = 'norm';
        param.scale = state.maxValues[parameterName] / 9;
      } else {
        param.uncertain = false;
        param.distribution = undefined;
        param.scale = undefined;
      }
      // state.events[eventIndex].parameters[parameterName] = param;
      Vue.set(state.events[eventIndex].parameters, parameterName, param)
    },
    DELETE_LAYER: (state, {eventIndex, layerIndex}) => {
      state.events[eventIndex].parameters.num_layers.value -= 1;
      state.events[eventIndex].parameters.layer_names.value.splice(layerIndex, 1);
      state.events[eventIndex].parameters.layer_thickness.value.splice(layerIndex, 1);
      state.events[eventIndex].parameters.lithology.value.splice(layerIndex, 1);
    },
    ADD_LAYER: (state, {eventIndex, layerIndex}) => {
      state.events[eventIndex].parameters.num_layers.value += 1;
      state.events[eventIndex].parameters.layer_names.value.splice(layerIndex, 0, "New Layer");
      state.events[eventIndex].parameters.layer_thickness.value.splice(layerIndex, 0, 100);
      state.events[eventIndex].parameters.lithology.value.splice(layerIndex, 0, 'Sandstone');
    }
  };
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };