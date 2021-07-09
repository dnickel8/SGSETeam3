<template>
  <div>
    <v-toolbar id="navbar" dense elevation="1" white>
      <v-app-bar-nav-icon class="hidden-md-and-up"></v-app-bar-nav-icon>
      <v-navigation-drawer app hide-overlay temporary />

      <v-toolbar-items d-flex>
        <v-btn @click="$router.push('/')">Main Page</v-btn>
        <v-btn
          v-if="$store.state.userRole == 'Admin'"
          @click="$router.push({ name: 'Article', query: { article: 'add' } })"
          >Artikel hinzufügen</v-btn
        >
      </v-toolbar-items>

      <v-spacer></v-spacer>
    </v-toolbar>
    <div
      v-for="(value, key, index) in kategorien"
      :key="`${key}-${index}`"
      class="row"
      style="margin-top: 1%; border: 1px solid black"
    >
      <div class="col-md-2">
        <center>
          <h2>
            <br /><br /><br />
            {{ key }}
          </h2>
        </center>
      </div>
      <div class="col-md-2" v-for="item in value" v-bind:key="item.name">
        <v-card :id="item.id" v-on:click="clickMethod" elevation="2">
          <img
            :id="item.id"
            v-on:click="clickMethod"
            :src="item.image"
            :alt="item.name"
            class="card-img-top"
            style="width: 100%; max-width: 600px"
          />

          <v-card-title :id="item.id" v-on:click="clickMethod">
            {{ item.name }}</v-card-title
          >
          <v-card-text :id="item.id" v-on:click="clickMethod">
            {{ item.price / 100 }}€</v-card-text
          >
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import CatalogService from "@/catalogService/services/catalog.service.js"
import ArticleService from "@/catalogService/services/article.service.js"
export default {
  name: "Catalog",
  data() {
    return {
        forSale: [
    ],
    forSale2: [
    ],
    kategorien: {},
    }

  },
  async created()
    {
      try
      {
        const response = await CatalogService.getData();
        for (let i = 0; i < response["data"].length; i++)
        {
          var article = response["data"][i];
          var temp = {}
          temp["id"] = article["_id"];
          temp["name"] = article["data"]["articlename"];
          temp["price"] = article["data"]["price"];
          temp["image"] = await ArticleService.getPicture(article["data"]["pictures"][0]);
          temp["image"] = temp["image"]["data"]["data"];

          if(this.kategorien[article.data.kategorie] === undefined )
          {
            this.kategorien[article.data.kategorie] = [];
          }
          this.kategorien[article.data.kategorie].push(temp);
        }
        this.test = response.data[0];
      }
      catch(e)
      {
        console.log(e);
      }
      this.$forceUpdate();
    },
  methods: {
    clickMethod()
    {
      this.$router.push({name: 'Article', params: {articleId: event.target.id},  query: { article: event.target.id } });
    },
  }
};
</script>
