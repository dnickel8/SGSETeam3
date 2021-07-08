<template>
  <div class="grey lighten-5">
    <v-card elevation="2" class="ma-3 pa-4 card-width-hack">
      <div class="text-h5 mb-4">Merkliste</div>
      <v-divider class="mb-5"></v-divider>
      <div v-if="showNoContentMessage" class="text-h6 mb-8">
        Sie haben noch keine Artikel hinzugefügt!
      </div>
      <wish-list-item
        v-for="product in products"
        v-bind:key="product.article_id"
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
      user_id: "lol",
      products: [],
    };
  },
  methods: {
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
        "http://localhost:8000/list/deleteArticle/" +
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
        .catch((error) => {
          console.log(error);
        });
    },
    transferToCart: function (product) {
      let post_url = "http://localhost:8000/cart/addArticle/" + this.user_id;
      this.axios
        .post(post_url, product)
        .then((response) => {
          if (response.status === 200) {
            let delete_url =
              "http://localhost:8000/list/deleteArticle/" +
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
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    let url = "http://localhost:8000/list/getArticles/" + this.user_id;
    this.axios
      .get(url)
      .then((response) => {
        if (response.status === 200) {
          let tmpArticles = response.data.articles;
          this.changeReceivedArticleData(tmpArticles);
          this.products = tmpArticles;
          if (this.products.length === 0) {
            this.showNoContentMessage = true;
          }
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

<style scoped>
.card-width-hack {
  height: 100%;
}
</style>
