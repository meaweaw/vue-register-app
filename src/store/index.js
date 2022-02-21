import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  plugins: [createPersistedState()],
  state() {
    return {
      user: {},
      accessToken: "",
      image: "https://img.icons8.com/bubbles/100/000000/administrator-male.png",
      btnloading: false,
      btndisabled: false,
    };
  },
  mutations: {
    setLoading(state, status) {
      state.btnloading = status;
      state.btndisabled = status;
    },
    setUser(state, user) {
      state.user = user;
    },
    setUserProfile(state, image) {
      state.user.profile = image;
    },
    setAccessToken(state, token) {
      state.accessToken = token;
    },
    logOut(state) {
      (state.user = {}), (state.accessToken = "");
    },
  },
});

export default store;
