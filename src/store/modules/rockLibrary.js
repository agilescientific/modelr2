const state = {
  currentLibrary: 'Mars',
  libraries: {
    Mars: [
      {
        name: 'Sandstone',
        density: 2600,
        color: '#CDFFD9',
        vp: 5300,
      },
      {
        name: 'Shale',
        density: 2450,
        color: '#ACE4C8',
        vp: 5200,
      },
      {
        name: 'Black Shale',
        density: 2450,
        color: '#DBFEBC',
        vp: 5100,
      },
      {
        name: 'Evaporite',
        density: 1650,
        color: '#9ACEFE',
        vp: 2700,
      },
      {
        name: 'Coal',
        density: 1300,
        color: '#820041',
        vp: 2300,
      },
      {
        name: 'Limestone',
        density: 2550,
        color: '#149EF8',
        vp: 5700,
      },
    ],
    Jupiter: [
      {
        name: 'Graywacke',
        density: 2600,
        color: '#69CF9C',
      },
      {
        name: 'Chert',
        density: 2450,
        color: '#AAC2C8'
      },
      {
        name: 'Black Shale',
        density: 2450,
        color: '#DBFEBC'
      },
      {
        name: 'Peat',
        density: 1650,
        color: '#FFCC99'
      },
      {
        name: 'Phonolite',
        density: 1300,
        color: '#5F391F'
      },
      {
        name: 'Amphibole Schist',
        density: 2550,
        color: '#B6B6CE'
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