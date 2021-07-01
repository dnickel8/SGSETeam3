<template>
  <div class="grey lighten-5">
    <v-card elevation="2" class="ma-3 pa-4 card-width-hack">
      <div class="text-h5 mb-4">Wunschliste</div>
      <v-divider class="mb-5"></v-divider>
      <div v-if="showNoContentMessage" class="text-h6 mb-8">
        Sie haben noch keine Artikel hinzugefügt!
      </div>
      <wish-list-item
        v-for="product in products"
        v-bind:key="product.id"
        v-bind:product="product"
        v-on:delete-article="deleteArticle(product)"
        v-on:transfer-to-cart="transferToCart(product)"
      ></wish-list-item>
    </v-card>
  </div>
</template>

<script>
import WishListItem from "@/cartservice/components/WishListItem";

export default {
  name: "WishList",
  components: { "wish-list-item": WishListItem },
  data: function () {
    return {
      showNoContentMessage: false,
      products: [
        // TODO: Remove test data
        {
          id: 0,
          checkboxValue: true,
          imgSource: "https://picsum.photos/id/11/500/300",
          articleName: "Micro",
          articleVendor: "Rode",
          articleCount: 1,
          articlePrice: 42,
        },
        {
          id: 1,
          checkboxValue: true,
          imgSource: "https://picsum.photos/id/11/500/300",
          articleName: "Lautsprecher",
          articleVendor: "Bose",
          articleCount: 2,
          articlePrice: 200,
        },
      ],
    };
  },
  methods: {
    deleteArticle: function (article) {
      // TODO: DB - delete article
      this.products.splice(this.products.indexOf(article), 1);
    },
    transferToCart: function (article) {
      // TODO: DB - transfer article
      this.products.splice(this.products.indexOf(article), 1);
    },
  },
};
</script>

<style scoped>
.card-width-hack {
  height: 100%;
}
</style>
