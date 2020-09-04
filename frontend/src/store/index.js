import Vue from 'vue'
import Vuex from 'vuex'
import history from './modules/history';
import settings from './modules/settings';
import rockLibrary from './modules/rockLibrary';
import preview from './modules/preview';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    history: history,
    settings: settings,
    rockLibrary: rockLibrary,
    preview: preview,
  },
  state: {
    modelExtent: [0, 10000, 0, 10000, 0, 5000],
    previewSection: undefined,
    previewSeismic: undefined,
    fastAPIurl: 'http://localhost:8000/',
  },

  mutations: {
  },

  actions: {}
})