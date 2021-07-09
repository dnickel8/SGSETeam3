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
  data: function () {
    return {
      keycloak: {},
    };
  },
  methods: {
    login: function () {
      let initOptions = {
        url: process.env.VUE_APP_ACCOUNT_SERVICE_URL + "/auth",
        realm: "Onlineshop",
        clientId: "frontend",
        onLoad: "login-required",
      };
      this.keycloak = Keycloak(initOptions);
      this.keycloak
        .init({ onLoad: initOptions.onLoad })
        .then((auth) => {
          if (!auth) {
            console.log(auth);
            console.log(this.keycloak.tokenParsed);
            console.log(this.keycloak.token);
            this.$store.commit("login", this.keycloak.token);
            this.$store.commit("setAuth", this.keycloak.authenticated);
            //window.location.reload();
          } else {
            console.log(auth);
            console.log(this.keycloak.tokenParsed);
            console.log(this.keycloak.token);
            this.$store.commit("login", this.keycloak.token);
            Vue.$log.info("Authenticated");
            this.$store.commit("setAuth", this.keycloak.authenticated);
            this.$store.commit("setUserId", this.keycloak.subject);
          }
        })
        .catch(() => {
          Vue.$log.error("Authenticated Failed");
        });
    },
    logout: function () {
      this.keycloak.logout(process.env.VUE_APP_URL + "/account/");
      /*window.location.replace(
        //TODO url anpassen
        process.env.VUE_APP_ACCOUNT_SERVICE_URL + "/auth/realms/Onlineshop/protocol/openid-connect/logout?redirect_uri=http://localhost:8081/account/"
      );*/
      this.$store.commit("logout");
      this.$$store.commit("setAuth", this.keycloak.authenticated);
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
