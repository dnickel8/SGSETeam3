<template>
  <v-container fluid fill-height class="grey lighten-5 container-center-hack">
    <v-btn
      v-on:click="login"
      v-if="!showNoContentMessage"
      x-big
      color="amber"
      class="text-none mb-3"
    >
      Anmelden
    </v-btn>
    <v-btn
      v-on:click="logout"
      v-if="!showNoContentMessage"
      x-big
      color="amber"
      class="text-none mb-3"
    >
      Abmelden
    </v-btn>
    <div class="text-h6 mb-8">{{ $store.getters.token }}</div>
  </v-container>
</template>

<script>
import Keycloak from "keycloak-js";
import store from "../../main.js";
import Vue from "vue";
export default {
  name: "Account",

  methods: {
    login: function () {
      let initOptions = {
        url: "http://127.0.0.1:8080/auth",
        realm: "Onlineshop",
        clientId: "frontend",
        onLoad: "login-required",
      };
      let keycloak = Keycloak(initOptions);
      keycloak
        .init({ onLoad: initOptions.onLoad })
        .then((auth) => {
          if (!auth) {
            store.commit("setAuth", false);
            window.location.reload();
          } else {
            store.commit("login", keycloak.token);
            Vue.$log.info("Authenticated");
            store.commit("setAuth", true);
          }
        })
        .catch(() => {
          Vue.$log.error("Authenticated Failed");
        });
    },
    logout: function () {
      window.location.replace(
        "http://localhost:8080/auth/realms/Onlineshop/protocol/openid-connect/logout?redirect_uri=http://localhost:8081/account/"
      );
      store.commit("logout");
      console.log(store.token);
    },
  },
};
</script>

<style scoped>
.container-center-hack {
  align-items: normal;
}
</style>
