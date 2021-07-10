import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import vuetify from "./plugins/vuetify";
import Cookies from "js-cookie";
import VueKeyCloak from "@dsb-norge/vue-keycloak-js";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Vuex);
Vue.use(VueKeyCloak, {
  init: {
    // Use 'login-required' to always require authentication
    // If using 'login-required', there is no need for the router guards in router.js
    onLoad: "login-required",
  },
  logout: {
    redirectUri: `${process.env.VUE_APP_FRONTEND_URL}/`,
  },
  config: {
    url: `${process.env.VUE_APP_ACCOUNT_SERVICE_URL}/auth`,
    clientId: "vue-app",
    realm: "vue",
  },
  onReady: () => {},
});

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
    token: {},
    orderAmount: "1.99",
    items: [],
    userRole: "",
    userId: "",
    cart_article_count: 0,
    products: [],
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
    setProducts(state, products) {
      state.products = products;
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
