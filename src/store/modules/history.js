const state = {
  events: [
    {
      type: "stratigraphy",
      name: undefined,
      parameters: {
        num_layers: 18,
        layer_names: [
          'layer 1', 'layer 2', 'layer 3',
          'layer 4', 'layer 5', 'layer 6',
          'layer 7', 'layer 8', 'layer 9',
          'layer 10', 'layer 11', 'layer 12',
          'layer 13', 'layer 14', 'layer 15',
          'layer 16', 'layer 17', 'layer 18'
        ],
        layer_thickness: [2500, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
        lithology: [
            "Sandstone", "Sandstone", "Shale", 'Coal', 'Sandstone', 'Sandstone', 'Sandstone', 'Sandstone', 'Sandstone',
            "Sandstone", "Sandstone", "Shale", 'Coal', 'Sandstone', 'Sandstone', 'Sandstone', 'Sandstone', 'Sandstone'
        ],
        density: [
            2600, 2600, 2450, 1300, 2600, 2600, 2600, 2600, 2600,
            2600, 2600, 2450, 1300, 2600, 2600, 2600, 2600, 2600
        ]
      }
    },
    {
      type: "fold",
      name: "Fold A",
      parameters: {
        name: "Fold A",
        pos: [200, 0, 700],
        amplitude: 100,
        wavelength: 10000
      }
    },
    {
      type: "fault",
      name: "Fault A",
      parameters: {
        name: "Fault B",
        pos: [1000, 0, 6000],
        dip: 50,
        dip_dir: 90,
        slip: 750
      }
    },
    {
      type: "fault",
      name: "Fault B",
      parameters: {
        name: "Fault C",
        pos: [9000, 0, 5000],
        dip: 60,
        dip_dir: 270,
        slip: 750
      }
    },
    {
      type: "fault",
      name: "Fault C",
      parameters: {
        pos: [9250, 0, 6000],
        dip: 60,
        dip_dir: 270,
        slip: 250
      }
    },

  ]
};
  
  const getters = {
    getEvents: (state) => state.events,
    getRockDensities: (state) => state.rockDensities
  };
  
  const actions = {
    updateEventParam({commit, dispatch, rootState}, payload) {
      commit('setEventParam', payload)
      if (rootState.settings.previewAutoReload) {
        dispatch('computeSection', null, { root: true })
      }
    },
    updateEventInsert({commit, dispatch, rootState}, payload) {
      commit('insertEvent', payload)
      if (rootState.settings.previewAutoReload) {
        dispatch('computeSection', null, { root: true })
      }
    },
    updateEventDelete({commit, dispatch, rootState}, payload) {
      commit('deleteEvent', payload)
      if (rootState.settings.previewAutoReload) {
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
    deleteEvent: (state, payload) => {
      state.events.splice(payload.index, 1)
    },
    setEventParam: (state, payload) => {
      state.events[payload.n].parameters[payload.key] = payload.value
    },
    appendEvent: (state, event) => (
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