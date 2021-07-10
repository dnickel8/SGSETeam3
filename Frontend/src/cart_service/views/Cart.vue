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
import CartItem from "@/cart_service/components/CartItem";

export default {
  name: "Cart",
  components: { "cart-item": CartItem },
  data: function () {
    return {
      showNoContentMessage: false,
      disableCheckoutButton: false,
      article_count: 0,
      total_amount: 0,
      user_id: "",
      products: [],
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
      return +tmpAmount.toFixed(2);
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
    deleteArticle: function (product) {
      let url =
        process.env.VUE_APP_CART_SERVICE_URL +
        "/cart/deleteArticle/" +
        this.user_id +
        "/" +
        product.article_id;
      this.axios
        .delete(url)
        .then((response) => {
          if (response.status === 200) {
            this.products.splice(this.products.indexOf(product), 1);
          }
        })
        .catch(() => {});
    },
    transferToWishlist: function (product) {
      let post_url =
        process.env.VUE_APP_CART_SERVICE_URL +
        "/list/addArticle/" +
        this.user_id;
      this.axios
        .post(post_url, product)
        .then((response) => {
          if (response.status === 200) {
            let delete_url =
              process.env.VUE_APP_CART_SERVICE_URL +
              "/cart/deleteArticle/" +
              this.user_id +
              "/" +
              product.article_id;
            this.axios
              .delete(delete_url)
              .then((response) => {
                if (response.status === 200) {
                  this.products.splice(this.products.indexOf(product), 1);
                }
              })
              .catch(() => {});
          }
        })
        .catch(() => {});
    },
    getSelectedProducts() {
      let tmpProducts = [];
      for (let i = 0; i < this.products.length; ++i) {
        let product = this.products[i];
        if (product.checkbox_value) {
          tmpProducts.push(product);
        }
      }
      return tmpProducts;
    },
    checkout: function () {
      this.$store.commit("setProducts", this.getSelectedProducts());
      this.$router.push({ name: "Order" });
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

        // Update article count badge
        this.$store.commit("setCartArticleCount", this.article_count);
      },
      deep: true,
    },
  },
  mounted() {
    // Get userID
    this.user_id = this.$store.state.userId;

    // Get products from redis database
    let url =
      process.env.VUE_APP_CART_SERVICE_URL +
      "/cart/getArticles/" +
      this.user_id;

    this.axios.get(url).then((response) => {
      if (response.status === 200) {
        let tmpArticles = response.data.articles;
        this.changeReceivedArticleData(tmpArticles);
        this.products = tmpArticles;
        if (this.products.length === 0) {
          this.showNoContentMessage = true;
        }
      }
    });
  },
};
</script>

<style scoped>
.container-center-hack {
  align-items: normal;
}
</style>
