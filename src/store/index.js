// store/index.js
import { createStore } from "vuex";

export default createStore({
  state: {
    selectedContinents: [],
  },
  mutations: {
    setSelectedContinents(state, selectedContinents) {
      state.selectedContinents = selectedContinents;
    },
  },
});
