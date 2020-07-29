const state = {
    currentLibrary: 'northsea',
    libraries: {
        northsea: [
            {
                name: 'Sandstone',
                density: '2600',
                color: '#E23B3BFF',
            },
            {
                name: 'Shale',
                density: '2450',
                color: '#4E6A8DFF'
            },
            {
                name: 'Coal',
                density: '1300',
                color: '#693838FF'
            },
            {
                name: 'Limestone',
                density: '2550',
                color: '#467979'
            }
        ],
        antarctica: [
            {
                name: 'Bafflestone',
                density: '2600',
                color: '#693838FF'
            },
            {
                name: 'Basalt',
                density: '2450',
                color: '#693838FF',
            },
            {
                name: 'Coal',
                density: '1300',
                color: '#693838FF',
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