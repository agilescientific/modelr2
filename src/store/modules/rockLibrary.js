const state = {
    currentLibrary: 'northsea',
    libraries: {
        northsea: [
            {
                name: 'Sandstone',
                density: '2600'
            },
            {
                name: 'Shale',
                density: '2450'
            },
            {
                name: 'Coal',
                density: '1300'
            }
        ],
        antarctica: [
            {
                name: 'Bafflestone',
                density: '2600'
            },
            {
                name: 'Basalt',
                density: '2450'
            },
            {
                name: 'Coal',
                density: '1300'
            }
        ]
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