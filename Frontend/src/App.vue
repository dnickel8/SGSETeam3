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
        <v-btn v-on:click="openUserSettings" class="ma-2" text icon>
          <v-icon large>mdi-account</v-icon>
        </v-btn>
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
    openUserSettings: function () {
      // TODO: login + logout + orders
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
