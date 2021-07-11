<template>
  <v-container fluid class="pa-0">
    <v-row align="center">
      <v-checkbox v-model="product.checkbox_value" class="ml-3"></v-checkbox>
      <v-img
        :src="image"
        :eager="true"
        :width="200"
        :height="140"
        contain
        class="ml-3 article-image-hack"
      ></v-img>
      <v-col class="pt-0">
        <v-btn
          v-on:click="visitArticleSite"
          text
          class="text-none pa-0 mb-1 title-button"
        >
          <div class="text-h6">{{ product.article_name }}</div>
        </v-btn>
        <div>Verkäufer: {{ product.article_vendor }}</div>
        <v-row align="center" justify="start" class="ml-0 mt-4">
          <v-text-field
            v-model="product.article_count"
            :rules="rules_number_input"
            min="1"
            max="999"
            label="Menge"
            hide-details
            type="number"
            style="width: 70px"
            class="shrink mr-3"
          ></v-text-field>
          <v-divider vertical></v-divider>
          <v-btn
            v-on:click="$emit('delete-article')"
            small
            color="amber"
            class="text-none mx-3"
          >
            Löschen
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn
            v-on:click="$emit('transfer-to-wishlist')"
            small
            color="amber"
            class="text-none mx-3"
          >
            Auf die Merkliste
          </v-btn>
        </v-row>
      </v-col>
      <div class="text-h6 mb-4 mr-6 ml-3">{{ product.article_price }} €</div>
    </v-row>
    <v-divider class="my-5"></v-divider>
  </v-container>
</template>

<script>
export default {
  name: "CartItem",
  props: ["product"],
  data: function () {
    return {
      image: "",
      rules_number_input: [
        (value) => !!value,
        (value) => !isNaN(value),
        (value) => value >= 1,
        (value) => value <= 999,
      ],
    };
  },
  methods: {
    updateArticleCount: function () {
      let url =
        process.env.VUE_APP_CART_SERVICE_URL + "/cart/updateArticleQuantity";

      let body = {
        article_id: this.product.article_id,
        new_quantity: this.product.article_count,
      };

      this.axios
        .put(url, body)
        .then()
        .catch(() => {});
    },
    visitArticleSite: function () {
      this.$router.push({
        name: "Article",
        query: { article: this.product.article_url },
      });
    },
  },
  watch: {
    "product.article_count": function (val) {
      if (val === "" || val < 1) {
        this.product.article_count = 1;
      }
      if (val > 999) {
        this.product.article_count = 999;
      }
      this.updateArticleCount();
    },
  },
  mounted() {
    this.axios.get(this.product.article_imagepath).then((response) => {
      if (response.status === 200) {
        this.image = response.data.data;
      }
    });
  },
};
</script>

<style scoped>
.article-image-hack {
  flex: none;
}
.title-button {
  min-width: 0;
}
</style>
