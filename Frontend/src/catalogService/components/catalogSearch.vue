<template>
  <div>
    <v-toolbar id="navbar" dense elevation="1" white>
      <v-app-bar-nav-icon class="hidden-md-and-up"></v-app-bar-nav-icon>
      <v-navigation-drawer app hide-overlay temporary />

      <v-toolbar-items d-flex>
        <v-btn @click="$router.push('/')">Main Page</v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>
      <form class="searchbar">
        <div class="searchbar-input">
          <div>
            <input
              type="search"
              placeholder="Search in items"
              black
              v-model="searchterm"
              style="display: none"
            />
            <input
              placeholder="Search in items"
              v-bind:value="searchterm"
              v-on:keyup.enter="searchMethod"
              v-on:input="searchterm = $event.target.value"
              black
            />
          </div>
        </div>
      </form>
    </v-toolbar>

    <table
      border="0"
      width="100%"
      cellspacing="0"
      cellpadding="5"
      summary="Layout"
      style="margin-top: 2%"
    >
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td width="20%">
          <center>
            <p>Marke</p>
            <div>
              <input type="checkbox" id="Marke1" name="marke1" checked />
              <label for="Marke1">Marke 1</label>
            </div>
            <div>
              <input type="checkbox" id="Marke2" name="Marke2" checked />
              <label for="Marke2">Marke 2</label>
            </div>
            <div>
              <input type="checkbox" id="Marke3" name="Marke3" checked />
              <label for="Marke3">Marke 3</label>
            </div>
            <div>
              <input type="checkbox" id="Marke4" name="Marke4" checked />
              <label for="Marke4">Marke 4</label>
            </div>
          </center>
        </td>
        <td width="80%">
          <div class="row" style="margin-top: 1%">
            <div class="col-md-2" v-for="item in forSale" v-bind:key="item.id">
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
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="js">
import CatalogService from "@/catalogService/services/catalogSearch.service.js"
import ArticleService from "@/catalogService/services/article.service.js"
export default {
  name: "CatalogSearch",
  data() {
    return {
        forSale: [],
        searchterm: "",
        searchCounter: "",
    }
  },
  async created()
    {
      let searchterm = this.$route.query.search;
      try
      {
        var response = await CatalogService.getData();
        for (let i = 0; i < response["data"].length; i++)
        {
          var article = response["data"][i];
          var temp = {}
          if (JSON.stringify(article).includes(searchterm))
          {
            temp["id"] = article["_id"];
            temp["name"] = article["data"]["articlename"];
            temp["price"] = article["data"]["price"];
            temp["image"] = await ArticleService.getPicture(article["data"]["pictures"][0]);
            temp["image"] = temp["image"]["data"]["data"];
            this.forSale.push(temp);
          }
        }
      }
      catch(e)
      {
        console.log(e);
      }
    },
  watch: {
    $route(to, from)
    {
      if(to["path"] == "/catalogSearch")
      {
        this.searchterm = to["query"]["search"];
        this.forSale = [];
        this.watchMethod();
      }
      if(from["path"] == "/article")
      {
        this.watchMethod();
      }
    }
  },

  methods: {
    clickMethod()
    {
      this.$router.push({name: 'Article', params: {articleId: event.target.id},  query: { article: event.target.id } });
    },
    searchMethod()
    {
      this.searchCounter = this.searchCounter + 1;
      this.$router.push({ query: { search: this.searchterm } }).catch(()=>{})
    },
    async watchMethod()
    {
      let searchterm = this.searchterm;
      try
      {
        const response = await CatalogService.getData();
        for (let i = 0; i < response["data"].length; i++)
        {
          var article = response["data"][i];
          var temp = {}
          if (JSON.stringify(article).includes(searchterm))
          {
            temp["id"] = article["_id"];
            temp["name"] = article["data"]["articlename"];
            temp["price"] = article["data"]["price"];
            temp["image"] = await ArticleService.getPicture(article["data"]["pictures"][0]);
            temp["image"] = temp["image"]["data"]["data"];
            this.forSale.push(temp);
          }
        }
      }
      catch(e)
      {
        console.log(e);
      }
    },
  }
};
</script>

<style>
h3 {
  color: #000;
}
</style>
