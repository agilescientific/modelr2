import axios from "axios";
import Vue from 'vue';
const extent = [0, 10000, 0, 1000, 0, 5000]

const state = {
  events: [
    {
      type: "stratigraphy",
      parameters: {
        num_layers: {
          value: 18
        },
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
        lithology: {
          value: [
            'Sandstone', 'Limestone', 'Shale', 'Sandstone', 'Limestone', 'Shale', 'Sandstone',
            'Sandstone', 'Limestone', 'Shale', 'Sandstone', 'Limestone', 'Shale', 'Limestone',
            'Sandstone', 'Limestone', 'Shale', 'Sandstone', 'Limestone'
          ]
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
    updateEvent({commit, dispatch, rootState}, payload) {
      commit('SET_EVENT', payload)
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
    }
  };
  
  const mutations = {
    INSERT_EVENT: (state, payload) => {
      state.events.splice(payload.index + 1, 0, payload.event);
    },
    DELETE_EVENT: (state, payload) => {
      state.events.splice(payload.index, 1);
    },
    SET_EVENT: (state, {i, parameters}) => {
      state.events[i].parameters = parameters;
    },
    SET_EVENT_PARAM: (state, {i, p, value}) => {
      // Overwrite the entire event parameter object
      state.events[i].parameters[p] = value;
    },
    SET_EVENT_VALUE: (state, {i, p, key, value}) => {
      // Overwrite the value of a specific parameter setting
      state.events[i].parameters[p][key] = value;
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
    }
  };
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };