<template>
  <div>
    <v-toolbar
      v-if="$store.state.userRole === 'Admin'"
      id="navbar"
      dense
      elevation="1"
      white
    >
      <v-app-bar-nav-icon class="hidden-md-and-up"></v-app-bar-nav-icon>
      <v-navigation-drawer app hide-overlay temporary />

      <v-toolbar-items d-flex>
        <v-btn
          v-if="$store.state.userRole === 'Admin'"
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
      <div class="col-md-2" v-for="item in value" v-bind:key="item.id">
        <v-card
          v-on:click="clickMethod(item.id)"
          elevation="2"
          style="height: 370px"
        >
          <v-img
            :src="item.image"
            :alt="item.name"
            :aspect-ratio="1"
            contain
            class=""
          ></v-img>
          <v-card-title> {{ item.name }}</v-card-title>
          <v-card-text> {{ item.price / 100 }}€</v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import CatalogService from "@/catalog_service/services/catalog.service.js"
import ArticleService from "@/catalog_service/services/article.service.js"
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
  async mounted()
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
          if(this.kategorien[article.data.kategorie].length < 5)
          {
            this.kategorien[article.data.kategorie].push(temp);
          }
        }
        this.test = response.data[0];


      this.$forceUpdate();
    },
  methods: {
    clickMethod(id)
    {
      this.$router.push({name: 'Article', query: { article: id } });
    },
  }
};
</script>
