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
      ></v-text-field>

      <div class="ml-4 d-flex align-center">
        <v-btn v-on:click="openCart" class="ma-2" text icon>
          <v-icon large>mdi-cart-outline</v-icon>
        </v-btn>
        <v-btn v-on:click="openWishlist" class="ma-2" text icon>
          <v-icon large>mdi-format-list-bulleted</v-icon>
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
      search: "",
    };
  },
  methods: {
    openHome: function () {
      this.$router.push({ name: "home" });
    },
    openCart: function () {
      this.$router.push({ name: "cart" });
    },
    openWishlist: function () {
      this.$router.push({ name: "wishlist" });
    },
    openUserSettings: function () {
      // TODO: login + logout + orders
    },
  },
};
</script>
