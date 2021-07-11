<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center mr-4">
        <v-btn v-on:click="openHome" text class="text-none">
          <div class="text-h4">MicroShop</div>
        </v-btn>
      </div>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        v-on:keyup.enter="searchMethod"
      ></v-text-field>

      <div class="ml-4 d-flex align-center">
        <v-btn
          v-on:click="openCart"
          v-if="$keycloak.authenticated"
          class="ma-2"
          text
          icon
        >
          <v-badge
            color="amber"
            :content="article_count_number"
            :value="article_count_display"
          >
            <v-icon large>mdi-cart-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-btn
          v-on:click="openWishlist"
          v-if="$keycloak.authenticated"
          class="ma-2"
          text
          icon
        >
          <v-icon large>mdi-format-list-bulleted</v-icon>
        </v-btn>

        <v-btn
          v-on:click="openHistory"
          v-if="$keycloak.authenticated"
          class="ma-2"
          text
          icon
        >
          <v-icon large>mdi-clock</v-icon>
        </v-btn>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs" class="ma-2" text icon>
              <v-icon large>mdi-account</v-icon>
            </v-btn>
          </template>

          <v-list v-if="$keycloak.ready">
            <v-list-item
              v-if="$keycloak.authenticated"
              @click="openAccount"
              link
            >
              <v-list-item-title>Mein Konto</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="!$keycloak.authenticated" @click="login" link>
              <v-list-item-title>Anmelden</v-list-item-title>
            </v-list-item>

            <v-list-item v-else @click="logout" link>
              <v-list-item-title>Abmelden</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: function () {
    return {
      search: "",
    };
  },
  methods: {
    openHome: function () {
      this.$router.push({ name: "Catalog" });
    },
    openCart: function () {
      this.$router.push({ name: "Cart" });
    },
    openWishlist: function () {
      this.$router.push({ name: "Wishlist" });
    },
    openHistory: function () {
      this.$router.push({ path: "OrderHistory" });
    },
    openAccount() {
      this.$router.push({ name: "Account" });
    },
    login() {
      this.$keycloak.login().then((login) => {
        if (login) {
          this.search = "JA";
        } else {
          this.search = "NEIN";
        }
      });
    },
    logout() {
      this.$keycloak.logoutFn();
    },
    searchMethod() {
      this.$router.push({
        name: "CatalogSearch",
        query: { search: this.search },
      });
    },
  },
  computed: {
    article_count_number() {
      let max = 999;
      let count = this.$store.state.cart_article_count;
      if (count > max) {
        return max + "+";
      } else {
        return count;
      }
    },
    article_count_display() {
      return this.$store.state.cart_article_count > 0;
    },
    userID() {
      return this.$store.state.userId;
    },
  },
  mounted() {
    if (this.$keycloak.authenticated) {
      // Get keycloak role
      if (
        this.$keycloak.realmAccess &&
        this.$keycloak.realmAccess.roles.indexOf("admin") > -1
      ) {
        this.$store.state.userRole = "Admin";
      } else {
        this.$store.state.userRole = "User";
      }

      // Get keycloak userID
      this.$store.state.userId = this.$keycloak.subject;

      // Get cart article count to update badge
      let url =
        process.env.VUE_APP_CART_SERVICE_URL +
        "/cart/getArticleCount/" +
        this.userID;
      this.axios
        .get(url)
        .then((response) => {
          if (response.status === 200) {
            this.$store.commit("setCartArticleCount", response.data.count);
          }
        })
        .catch(() => {});
    } else {
      this.search = "TEST TEST TEST";
    }
  },
};
</script>
