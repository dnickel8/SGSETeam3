<template>
  <div>
    <v-toolbar
      v-if="$store.state.userRole == 'Admin'"
      id="navbar"
      dense
      elevation="1"
      white
    >
      <v-app-bar-nav-icon class="hidden-md-and-up"></v-app-bar-nav-icon>
      <v-navigation-drawer app hide-overlay temporary />

      <v-toolbar-items d-flex>
        <v-btn
          v-if="$store.state.userRole == 'Admin'"
          @click="$router.push({ name: 'Article', query: { article: 'add' } })"
          >Artikel hinzufügen</v-btn
        >
      </v-toolbar-items>

      <v-spacer></v-spacer>
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
        <td width="30%">
          <center>
            <div style="display: inline">
              <p style="display: inline-block">&nbsp; Preis von: &nbsp;</p>
              <v-text-field
                v-model="preisMin"
                style="display: inline-block; max-width: 50px; max-height: 10px"
              />
              <p style="display: inline-block">€ &nbsp; bis:&nbsp;</p>
              <v-text-field
                v-model="preisMax"
                style="display: inline-block; max-width: 50px; max-height: 10px"
              />
              <p style="display: inline-block">€</p>
            </div>
            <h3>Hersteller</h3>
            <div v-for="(value, key, index) in hersteller" :key="index">
              <input
                type="checkbox"
                :id="key"
                @change="checkboxHersteller($event)"
              />
              <label> {{ key }}</label>
            </div>
          </center>
          <br />
          <center>
            <h3>Kategorie</h3>
            <div v-for="(value, key, index) in kategorie" :key="index">
              <input
                type="checkbox"
                :id="key"
                @change="checkboxKategorie($event)"
              />
              <label> {{ key }}</label>
            </div>
            <v-btn style="margin: 2%" @click="update">Aktualisieren</v-btn>
          </center>
        </td>
        <td width="70%">
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
import CatalogService from "@/catalog_service/services/catalogSearch.service.js"
import ArticleService from "@/catalog_service/services/article.service.js"
export default {
  name: "CatalogSearch",
  data() {
    return {
        forSale: [],
        searchterm: "",
        hersteller: {},
        kategorie: {},

        allArticles: [],
        preisMin: "",
        preisMax: "",
    }
  },
  async created()
    {
      await this.watchMethod();
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
        this.forSale = [];
        this.watchMethod();
      }
    }
  },

  methods: {
    clickMethod()
    {
      this.$router.push({name: 'Article', params: {articleId: event.target.id},  query: { article: event.target.id } });
    },
    checkboxHersteller()
    {
      if(this.hersteller[event.target.id] == true)
      {
        this.hersteller[event.target.id] = false;
      }
      else
      {
        this.hersteller[event.target.id] = true;
      }
    },
    checkboxKategorie()
    {
      if(this.kategorie[event.target.id] == true)
      {
        this.kategorie[event.target.id] = false;
      }
      else
      {
        this.kategorie[event.target.id] = true;
      }
    },
    async update()
    {
      //Preiseingabe überprüfen
      var regex = new RegExp(/^(\d)+(,|\.){0,1}(\d){0,2}$/);
      if(!(this.preisMin == "" || regex.test(this.preisMin)))
      {
        alert("Ungültige Eingabe für den Minimalpreis.");
        return;
      }
      if(!(this.preisMax == "" || regex.test(this.preisMax)))
      {
        alert("Ungültige Eingabe für den Maximalpreis.");
        return;
      }

      this.forSale = [];
      let searchterm = this.$route.query.search;

      let manufacturer = [];
      let category = [];
      for(var key in this.hersteller)
      {
        var value = this.hersteller[key];
        if(value)
        {
          manufacturer.push(key);
        }
      }
      for(key in this.kategorie)
      {
        value = this.kategorie[key];
        if(value)
        {
          category.push(key);
        }
      }

      var tempJson = {};
      if(manufacturer.length != 0)
      {
        tempJson["hersteller"] = manufacturer;
      }
      if(category.length != 0)
      {
        tempJson["kategorie"] = category;
      }
      //Preise formatieren
      if(this.preisMin != "")
      {
        let minPreis = "";
        if(this.preisMin.includes("."))
        {
          var split = this.preisMin.split(".")
          //1 Nachkommastelle
          if(split[1].length == 1)
          {
            minPreis = this.preisMin + "0";
          }
          else if (split[1].length == 0)
          {
            minPreis = this.preisMin + "00";
          }
          else
          {
            minPreis = this.preisMin;
          }
        }
        if(this.preisMin.includes(","))
        {
          var split4 = this.preisMin.split(",")
          //1 Nachkommastelle
          if(split4[1].length == 1)
          {
            minPreis = this.preisMin + "0";
          }
          else if (split4[1].length == 0)
          {
            minPreis = this.preisMin + "00";
          }
          else
          {
            minPreis = this.preisMin;
          }
        }
        //keine Nachkommastelle
        else
        {
          minPreis = this.preisMin + "00"
        }
        minPreis = minPreis.replace(".", "");
        minPreis = minPreis.replace(",", "");
        tempJson["preisMin"] = minPreis;
      }
      if(this.preisMax != "")
      {
        let maxPreis = "";
        if(this.preisMax.includes("."))
        {
          var split2 = this.preisMax.split(".")
          //1 Nachkommastelle
          if(split2[1].length == 1)
          {
            maxPreis = this.preisMax + "0";
          }
          else if (split2[1].length == 0)
          {
            maxPreis = this.preisMax + "00";
          }
          else
          {
            maxPreis = this.preisMax;
          }
        }
        if(this.preisMax.includes(","))
        {
          var split3 = this.preisMax.split(",")
          //1 Nachkommastelle
          if(split3[1].length == 1)
          {
            maxPreis = this.preisMax + "0";
          }
          else if (split3[1].length == 0)
          {
            maxPreis = this.preisMax + "00";
          }
          else
          {
            maxPreis = this.preisMax;
          }
        }
        //keine Nachkommastelle
        else
        {
          maxPreis = this.preisMax + "00"
        }
        maxPreis = maxPreis.replace(".", "");
        maxPreis = maxPreis.replace(",", "");
        tempJson["preisMax"] = maxPreis;
      }

        const response = await CatalogService.search(searchterm, tempJson);
        this.allArticles = response;
        for (let i = 0; i < response["data"].length; i++)
        {
          var article = response["data"][i];
          var temp = {}
          temp["id"] = article["_id"];
          temp["name"] = article["data"]["articlename"];
          temp["price"] = article["data"]["price"];
          temp["image"] = await ArticleService.getPicture(article["data"]["pictures"][0]);
          temp["image"] = temp["image"]["data"]["data"];
          this.forSale.push(temp);
        }
    },
    async watchMethod()
    {
      const manufacturer = await CatalogService.getManufacturer();
      const category = await CatalogService.getCategory();
      for(let i = 0; i < manufacturer["data"].length; i++)
      {
        this.hersteller[manufacturer["data"][i]] = false;
      }
      for(let i = 0; i < category["data"].length; i++)
      {
        this.kategorie[category["data"][i]] = false;
      }

      let searchterm = this.$route.query.search;

      const response = await CatalogService.search(searchterm, "");
      this.allArticles = response;
      for (let i = 0; i < response["data"].length; i++)
      {
        var article = response["data"][i];
        var temp = {}
        temp["id"] = article["_id"];
        temp["name"] = article["data"]["articlename"];
        temp["price"] = article["data"]["price"];
        temp["image"] = await ArticleService.getPicture(article["data"]["pictures"][0]);
        temp["image"] = temp["image"]["data"]["data"];
        this.forSale.push(temp);
      }
    }
  },
};
</script>
