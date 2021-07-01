<template>
  <v-container fluid class="pa-0">
    <v-row align="center">
      <v-img
        v-bind:src="product.imgSource"
        :width="200"
        :height="140"
        contain
        class="ml-3 article-image-hack"
      ></v-img>
      <v-col class="pt-0">
        <div class="text-h6 mb-1">{{ product.articleName }}</div>
        <div>Verkäufer: {{ product.articleVendor }}</div>
        <div>Preis: {{ product.articlePrice }} €</div>
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
};
</script>

<style scoped>
.article-image-hack {
  flex: none;
}
</style>
