const state = {
  library: [
    {
      name: 'Sandstone',
      density: 2600,
      color: '#CDFFD9',
      vp: 2700,
    },
    {
      name: 'Shale',
      density: 2450,
      color: '#ACE4C8',
      vp: 2500,
    },
    {
      name: 'Black Shale',
      density: 2450,
      color: '#DBFEBC',
      vp: 2300,
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
      vp: 2450,
    },
  ],
  // libraries: {
  //   "North Sea":
  //     [
  //       {
  //         name: "Sandstone",
  //         color: "#eae56d",
  //         properties: {
  //           density: {
  //             value: 2600,
  //             uncertain: false,
  //           },
  //           vp: {
  //             value: 2700,
  //             uncertain: false,
  //           }
  //         }
  //       },
  //       {
  //         name: "Siltstone",
  //         color: "#ea6dc7",
  //         properties: {
  //           density: {
  //             value: 2340,
  //             uncertain: false,
  //           },
  //           vp: {
  //             value: 2400,
  //             uncertain: false,
  //           }
  //         }
  //       },
  //       {
  //         name: "Mudstone",
  //         color: "#67643a",
  //         properties: {
  //           density: {
  //             value: 2200,
  //             uncertain: false,
  //           },
  //           vp: {
  //             value: 2300,
  //             uncertain: false,
  //           }
  //         }
  //       },
  //       {
  //         name: "Coal",
  //         color: "#292926",
  //         properties: {
  //           density: {
  //             value: 1900,
  //             uncertain: false,
  //           },
  //           vp: {
  //             value: 1950,
  //             uncertain: false,
  //           }
  //         }
  //       },
  //       {
  //         name: "Shale",
  //         color: "#CDFFD9",
  //         properties: {
  //           density: {
  //             value: 2400,
  //             uncertain: false,
  //           },
  //           vp: {
  //             value: 2400,
  //             uncertain: false,
  //           }
  //         }
  //       },
  //       {
  //         name: "Limestone",
  //         color: "#4268a0",
  //         properties: {
  //           density: {
  //             value: 2800,
  //             uncertain: false,
  //           },
  //           vp: {
  //             value: 2500,
  //             uncertain: false,
  //           }
  //         }
  //       },
  //       {
  //         name: "Wackestone",
  //         color: "#41545d",
  //         properties: {
  //           density: {
  //             value: 2600,
  //             uncertain: false,
  //           },
  //           vp: {
  //             value: 2700,
  //             uncertain: false,
  //           }
  //         }
  //       },
  //       {
  //         name: "Granite",
  //         color: "#d93946",
  //         properties: {
  //           density: {
  //             value: 3100,
  //             uncertain: false,
  //           },
  //           vp: {
  //             value: 2900,
  //             uncertain: false,
  //           }
  //         }
  //       }
  //     ]
  // },
  // libraries: {
  //   'North Sea': [
  //     {
  //       name: 'Sandstone',
  //       density: 2600,
  //       color: '#CDFFD9',
  //       vp: 2700,
  //     },
  //     {
  //       name: 'Shale',
  //       density: 2450,
  //       color: '#ACE4C8',
  //       vp: 2500,
  //     },
  //     {
  //       name: 'Black Shale',
  //       density: 2450,
  //       color: '#DBFEBC',
  //       vp: 2300,
  //     },
  //     {
  //       name: 'Evaporite',
  //       density: 1650,
  //       color: '#9ACEFE',
  //       vp: 2700,
  //     },
  //     {
  //       name: 'Coal',
  //       density: 1300,
  //       color: '#820041',
  //       vp: 2300,
  //     },
  //     {
  //       name: 'Limestone',
  //       density: 2550,
  //       color: '#149EF8',
  //       vp: 2450,
  //     },
  //   ]
  // }
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