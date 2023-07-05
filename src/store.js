import { createStore } from 'vuex';

const store = createStore({
  state: {
    mostrarHeaderFooter: true,
    authenticated: false
  },
  mutations: {
    ocultarHeaderFooter(state) {
      state.mostrarHeaderFooter = false;
    },
    mostrarHeaderFooter(state) {
      state.mostrarHeaderFooter = true;
    },
    setUser(state, user) {
      // console.log(user);
      // state.user = user;
      state.user = { ...user, id: user.idcreador };
    },
    setAuthenticated(state, value) { 
      state.authenticated = value;
    },
    logout(state) {    
      state.user = null;
      state.token = null;
    },
  },
  actions: {
    ocultarHeaderFooter({ commit }) {            
      commit('ocultarHeaderFooter');
    },
    mostrarHeaderFooter({ commit }) {
      commit('mostrarHeaderFooter');
    },
  },
  getters: {
    mostrarHeaderFooter: state => state.mostrarHeaderFooter,
  },
});

export default store;
