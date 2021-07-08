import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import vuetify from "./plugins/vuetify";
import Cookies from "js-cookie";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => Cookies.get(key),
        setItem: (key, value) => Cookies.set(key, value, { expires: 1 }),
        removeItem: (key) => Cookies.remove(key),
      },
    }),
  ],
  state: {
    exampleState: "",
    token: Object,
    orderAmount: "1.99",
    items: [],
    userRole: "",
    userId: "",
    cart_article_count: 0,
  },
  mutations: {
    setExampleState(state, example) {
      state.exampleState = example;
    },
    logout(state) {
      state.token = Object();
    },
    login(state, token) {
      state.token = token;
    },
    setUserRole(state, role) {
      state.userRole = role;
    },
    setOrderAmount(state, newOrderAmount) {
      state.orderAmount = newOrderAmount;
    },
    setItems(state, items) {
      state.items = items;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    setCartArticleCount(state, count) {
      state.cart_article_count = count;
    },
    incrementCartArticleCount(state) {
      state.cart_article_count++;
    },
  },
  getters: {
    token: (state) => {
      return state.token;
    },
  },
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
