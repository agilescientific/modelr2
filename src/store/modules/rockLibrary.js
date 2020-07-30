const state = {
  currentLibrary: 'mars',
  libraries: {
    mars: [
      {
          name: 'Sandstone',
          density: 2600,
          color: '#CDFFD9',
      },
      {
          name: 'Shale',
          density: 2450,
          color: '#ACE4C8'
      },
      {
        name: 'Black Shale',
        density: 2450,
        color: '#DBFEBC'
      },
      {
        name: 'Evaporite',
        density: 1650,
        color: '#9ACEFE'
      },
      {
          name: 'Coal',
          density: 1300,
          color: '#820041'
      },
      {
          name: 'Limestone',
          density: 2550,
          color: '#149EF8'
      },
    ],
  }
}

const getters = {
};

const actions = {
};

const mutations = {
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};