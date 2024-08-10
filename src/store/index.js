import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    updateUserFunds(state, funds) {
      if (state.user) {
        state.user.funds = funds;
      }
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user);
    },
    updateUserFunds({ commit }, funds) {
      commit('updateUserFunds', funds);
    },
  },
  getters: {
    user: (state) => state.user,
  },
});
