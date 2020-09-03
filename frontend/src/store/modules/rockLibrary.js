const state = {
  library: [
    {
      name: 'Sandstone',
      density: 2600,
      color: '#FFCC00',
      vp: 2700,
    },
    {
      name: 'Siltstone',
      density: 2550,
      color: '#bca64f',
      vp: 2450,
    },
    {
      name: 'Shale',
      density: 2450,
      color: '#b8e07b',
      vp: 2500,
    },
    {
      name: 'Black Shale',
      density: 2450,
      color: '#454545',
      vp: 2300,
    },
    {
      name: 'Evaporite',
      density: 1650,
      color: '#b8b8b8',
      vp: 2700,
    },
    {
      name: 'Coal',
      density: 1300,
      color: '#539f6c',
      vp: 2300,
    },
    {
      name: 'Limestone',
      density: 2550,
      color: '#3399CC',
      vp: 2450,
    },
  ],
}

const getters = {
};

const actions = {
};

const mutations = {
  ADD_ROCK: (state, {name, density, vp, color}) => {
    state.library.push(
        {
          name: name,
          color: color,
          density: density,
          vp: vp,
        }
    )
  },
  DELETE_ROCK: (state, {index}) => {
    state.library.splice(index, 1)
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};