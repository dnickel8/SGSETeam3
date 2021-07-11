<template>
  <v-container fluid class="pa-0">
    <v-row align="center">
      <v-img
        :src="getImage"
        :width="200"
        :height="140"
        contain
        class="ml-3 article-image-hack"
      ></v-img>
      <v-col class="pt-0">
        <v-btn v-on:click="visitArticleSite" text class="text-none mb-1 pa-0">
          <div class="text-h6">{{ product.article_name }}</div>
        </v-btn>
        <div>Verkäufer: {{ product.article_vendor }}</div>
        <div>Preis: {{ product.article_price }} €</div>
        <v-row align="center" justify="start" class="ml-0 mt-2">
          <v-btn
            v-on:click="$emit('transfer-to-cart')"
            small
            color="amber"
            class="text-none mr-3"
          >
            In den Einkaufswagen
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn
            v-on:click="$emit('delete-article')"
            small
            color="amber"
            class="text-none mx-3"
          >
            Löschen
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-5"></v-divider>
  </v-container>
</template>

<script>
export default {
  name: "WishListItem",
  props: ["product"],
  methods: {
    visitArticleSite: function () {
      this.$router.push({
        name: "Article",
        query: { article: this.product.article_url },
      });
    },
    getImage: function () {
      this.axios.get(this.product.article_imagepath).then((response) => {
        if (response.status === 200) {
          return response.data.data;
        }
      });
    },
  },
};
</script>

<style scoped>
.article-image-hack {
  flex: none;
}
</style>
