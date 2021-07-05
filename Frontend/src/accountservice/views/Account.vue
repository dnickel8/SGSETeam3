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
    <div class="text-h6 mb-8">{{ this.$store.getters.token.assign }}</div>
  </v-container>
</template>

<script>
import Keycloak from "keycloak-js";
import Vue from "vue";
export default {
  name: "Account",
  methods: {
    login: function () {
      let initOptions = {
        url: "http://35.246.228.139/auth", //TODO Url anpassen
        realm: "Onlineshop",
        clientId: "frontend",
        onLoad: "login-required",
      };
      let keycloak = Keycloak(initOptions);
      keycloak
        .init({ onLoad: initOptions.onLoad })
        .then((auth) => {
          if (!auth) {
            this.$store.commit("login", keycloak.token);
            this.$store.commit("setAuth", false);
            window.location.reload();
          } else {
            this.$store.commit("login", keycloak.token);
            Vue.$log.info("Authenticated");
            this.$store.commit("setAuth", true);
          }
        })
        .catch(() => {
          Vue.$log.error("Authenticated Failed");
        });
    },
    logout: function () {
      window.location.replace(
        //TODO url anpassen
        "http://35.246.228.139/auth/realms/Onlineshop/protocol/openid-connect/logout?redirect_uri=http://localhost:8081/account/"
      );
      this.$store.commit("logout");
      console.log(this.$store.state.token);
    },
  },
};
</script>

<style scoped>
.container-center-hack {
  align-items: normal;
}
</style>
