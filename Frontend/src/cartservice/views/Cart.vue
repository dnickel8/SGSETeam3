<template>
  <v-container fluid fill-height class="grey lighten-5 container-center-hack">
    <v-row>
      <v-col md="9">
        <v-card elevation="2" class="pa-4">
          <div class="text-h5 mb-4">Einkaufswagen</div>
          <v-btn
            v-on:click="clearAllSelections"
            v-if="!showNoContentMessage"
            x-small
            color="amber"
            class="text-none mb-3"
          >
            Auswahl aller Artikel aufheben
          </v-btn>
          <v-row v-if="!showNoContentMessage" justify="end" class="mb-1 mr-4">
            Preis
          </v-row>
          <v-divider class="mb-5"></v-divider>
          <div v-if="showNoContentMessage" class="text-h6 mb-8">
            Sie haben noch keine Artikel hinzugefügt!
          </div>
          <cart-item
            v-for="product in products"
            v-bind:key="product.article_id"
            v-bind:product="product"
            v-on:delete-article="deleteArticle(product)"
            v-on:transfer-to-wishlist="transferToWishlist(product)"
          ></cart-item>
          <v-row justify="end">
            <div
              v-if="!showNoContentMessage"
              class="text-center text-h6 mr-3 mb-4"
            >
              Summe ({{ article_count }} Artikel): {{ total_amount }}€
            </div>
          </v-row>
        </v-card>
      </v-col>
      <v-col md="3">
        <v-card elevation="2" class="pa-4">
          <div class="text-center text-h6 mb-4">
            Summe ({{ article_count }} Artikel): {{ total_amount }}€
          </div>
          <v-btn
            v-on:click="checkout"
            :disabled="disableCheckoutButton"
            block
            color="yellow"
          >
            Zur Kasse gehen
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CartItem from "@/cartservice/components/CartItem";

export default {
  name: "Cart",
  components: { "cart-item": CartItem },
  data: function () {
    return {
      showNoContentMessage: false,
      disableCheckoutButton: false,
      article_count: 0,
      total_amount: 0,
      user_id: "lol",
      products: [
        // {  // Test data
        //   id: 0,
        //   checkboxValue: true,
        //   imgSource: "https://picsum.photos/id/11/500/300",
        //   articleName: "Micro",
        //   articleVendor: "Rode",
        //   articleCount: 1,
        //   articlePrice: 42,
        // },
      ],
    };
  },
  methods: {
    countArticles: function () {
      let counter = 0;
      for (let i = 0; i < this.products.length; ++i) {
        let product = this.products[i];
        if (product.checkbox_value) {
          counter += parseInt(product.article_count, 10);
        }
      }
      return counter;
    },
    calculateTotalAmount: function () {
      let tmpAmount = 0;
      for (let i = 0; i < this.products.length; ++i) {
        let product = this.products[i];
        if (product.checkbox_value) {
          tmpAmount += product.article_count * product.article_price;
        }
      }
      return tmpAmount;
    },
    clearAllSelections: function () {
      for (let i = 0; i < this.products.length; ++i) {
        let product = this.products[i];
        product.checkbox_value = false;
      }
    },
    changeReceivedArticleData: function (articles) {
      for (let i = 0; i < articles.length; ++i) {
        articles[i]["checkbox_value"] = true;
        articles[i]["article_count"] = parseInt(
          articles[i]["article_count"],
          10
        );
        articles[i]["article_price"] = parseFloat(articles[i]["article_price"]);
      }
    },
    deleteArticle: function (article) {
      // TODO: DB - delete article
      this.products.splice(this.products.indexOf(article), 1);
    },
    transferToWishlist: function (article) {
      // TODO: DB - transfer article
      this.products.splice(this.products.indexOf(article), 1);
    },
    checkout: function () {
      // TODO: Go to order service
      this.$router.push({ name: "wishlist" });
    },
  },
  watch: {
    products: {
      immediate: true,
      handler: function () {
        this.article_count = this.countArticles();
        this.total_amount = this.calculateTotalAmount();
      },
      deep: true,
    },
    article_count: {
      immediate: true,
      handler: function () {
        if (this.products.length === 0) {
          this.showNoContentMessage = true;
          this.disableCheckoutButton = true;
        } else {
          this.showNoContentMessage = false;
          this.disableCheckoutButton = this.article_count < 1;
        }
      },
      deep: true,
    },
  },
  mounted() {
    let url = "http://localhost:8000/cart/getArticles/" + this.user_id;
    this.axios
      .get(url)
      .then((response) => {
        let tmpArticles = response.data.articles;
        this.changeReceivedArticleData(tmpArticles);
        this.products = tmpArticles;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>
.container-center-hack {
  align-items: normal;
}
</style>
