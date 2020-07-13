const state = {
  events: [
    {
      type: "stratigraphy",
      name: undefined,
      parameters: {
        num_layers: 8,
        layer_names: [
          'layer 1', 'layer 2', 'layer 3',
          'layer 4', 'layer 5', 'layer 6',
          'layer 7', 'layer 8'
        ],
        layer_thickness: [1500, 500, 500, 500, 500, 500, 500, 500],
        lithology: ["Sandstone", "Sandstone", "Shale", 'Coal', 'Sandstone', 'Sandstone', 'Sandstone', 'Sandstone'],
        density: [2600, 2600, 2450, 1300, 2600, 2600, 2600, 2600]
      }
    },
    {
      type: "fault",
      name: "Fault A",
      parameters: {
        pos: [1000, 0, 6000],
        dip: 45,
        dip_dir: 90,
        slip: 750
      }
    },
    {
      type: "fold",
      name: "Fold A",
      parameters: {
        pos: [200, 0, 700],
        amplitude: 100,
        wavelength: 10000
      }
    }
  ]
};
  
  const getters = {
    getEvents: (state) => state.events,
    getRockDensities: (state) => state.rockDensities
  };
  
  const actions = {
    updateLayerThickness({commit, dispatch, rootState}, payload) {
      commit('setLayerThickness', payload)
      if (rootState.autoReloadPreview) {
        dispatch('computeSection', null, { root: true })
      }
    }
  };
  
  const mutations = {
    setHistory: (state, events) => (
      state.events = events
    ),
    setEvent: (state, payload) => (
      state.events[payload.n] = payload.event
    ),
    insertEvent: (state, payload) => {
      state.events.splice(payload.index + 1, 0, payload.event)
    },
    setLayerThickness: (state, payload) => {
      state.events[0].parameters.layer_thickness[payload.n] = payload.value;
    },
    setLayerLithology: (state, payload) => {
      state.events[0].parameters.lithology[payload.n] = payload.value
      console.log("modified")
    },
    setLayerDensity: (state, payload) => (
      state.events[0].parameters.density[payload.n] = payload.value
    ),
    setEventParam: (state, payload) => (
      state.events[payload.n].parameters[payload.key] = payload.value
    ),
    addEvent: (state, event) => (
      state.events.push(event)
    )
  };
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };