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
        <v-btn v-on:click="openCart" class="ma-2" text icon>
          <v-badge
            color="amber"
            :content="article_count_number"
            :value="article_count_display"
          >
            <v-icon large>mdi-cart-outline</v-icon>
          </v-badge>
        </v-btn>
        <v-btn v-on:click="openWishlist" class="ma-2" text icon>
          <v-icon large>mdi-format-list-bulleted</v-icon>
        </v-btn>
        <v-btn v-on:click="openHistory" class="ma-2" text icon>
          <v-icon large>mdi-clock</v-icon>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }"
            ><v-btn v-on="on" v-bind="attrs" class="ma-2" text icon>
              <v-icon large>mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-if="$keycloak.authenticated"
              @click="openAccount"
              link
            >
              <v-list-item-title>Account</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="!$keycloak.authenticated" @click="login" link>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="$keycloak.authenticated" @click="logout" link>
              <v-list-item-title>Logout</v-list-item-title>
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
      user_id: "lol",
      search: "",
    };
  },
  methods: {
    openHome: function () {
      this.$router.push({ name: "CatalogView" });
    },
    openCart: function () {
      this.$router.push({ name: "cart" });
    },
    openWishlist: function () {
      this.$router.push({ name: "wishlist" });
    },
    openHistory: function () {
      this.$router.push({ path: "history" });
    },
    openAccount() {
      this.$router.push({ name: "account" });
    },
    login() {
      this.$keycloak.login();
    },
    logout() {
      this.$keycloak.logoutFn();
    },
    searchMethod() {
      this.$router.push({
        name: "CatalogSearchView",
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
  },
  mounted() {
    if (this.$keycloak.realmAccess.roles.indexOf("admin") > -1) {
      this.$store.state.userRole = "Admin";
    } else {
      this.$store.state.userRole = "User";
    }
    this.$store.userId = this.$keycloak.subject;
    // Get cart article count to update badge
    let url =
      process.env.VUE_APP_CART_SERVICE_URL +
      "/cart/getArticleCount/" +
      this.user_id;
    this.axios
      .get(url)
      .then((response) => {
        if (response.status === 200) {
          this.$store.commit("setCartArticleCount", response.data.count);
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
