<template>
  <div>
    <v-toolbar id="navbar" dense elevation="1" white>
      <v-app-bar-nav-icon class="hidden-md-and-up"></v-app-bar-nav-icon>
      <v-navigation-drawer app hide-overlay temporary />

      <v-toolbar-items d-flex>
        <v-btn @click="$router.push('/')">Main Page</v-btn>
        <v-btn
          v-if="
            $store.state.userRole == 'Admin' &&
            this.$route.query.article == 'add'
          "
          @click="save"
          >Artikel speichern</v-btn
        >
        <v-btn
          v-if="$store.state.userRole == 'Admin' && this.articleId.length > 20"
          @click="deleteArticle"
          >Artikel löschen</v-btn
        >
        <v-btn
          v-if="
            $store.state.userRole == 'Admin' &&
            this.articleId.length > 20 &&
            this.edit == false
          "
          @click="editArticle"
          >Artikel bearbeiten</v-btn
        >
        <v-btn
          v-if="
            $store.state.userRole == 'Admin' &&
            this.articleId.length > 20 &&
            this.edit == true
          "
          @click="editArticleSave"
          >Änderungen speichern</v-btn
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
        <td width="50%">
          <center>
            <textarea
              v-if="this.addArticle"
              placeholder="Produktbeschreibung"
              style="width: 80%; height: 300px; border: solid 1px black"
              v-bind:value="description"
              v-on:input="description = $event.target.value"
            >
            </textarea>
            <textarea
              v-else-if="this.edit"
              placeholder="Produktbeschreibung"
              style="width: 80%; height: 300px; border: solid 1px black"
              v-bind:value="description"
              v-on:input="description = $event.target.value"
            >
            </textarea>

            <div v-else>
              <h1>{{ articlename }}</h1>

              <pre style="padding: 10%; margin-top: -50px">
              {{ description }}
            </pre
              >
            </div>
          </center>
        </td>
        <td width="50%">
          <center>
            <div v-if="this.addArticle">
              <UploadImages style="width: 60%" @changed="handleImages" />
              <input
                placeholder="Artikelname"
                style="margin: 10px; border: solid 1px black"
                v-bind:value="articlename"
                v-on:input="articlename = $event.target.value"
              />
              <input
                placeholder="Preis (9,99€ = 999)"
                style="margin: 10px; border: solid 1px black"
                v-bind:value="price"
                v-on:input="price = $event.target.value"
              />
              <input
                placeholder="Hersteller"
                style="margin: 10px; border: solid 1px black"
                v-bind:value="hersteller"
                v-on:input="hersteller = $event.target.value"
              />
              <input
                placeholder="Kategorie"
                style="margin: 10px; border: solid 1px black"
                v-bind:value="kategorie"
                v-on:input="kategorie = $event.target.value"
              />
            </div>
            <div v-else-if="this.edit">
              <UploadImages style="width: 60%" @changed="handleImages" />
              <input
                placeholder="Artikelname"
                style="margin: 10px; border: solid 1px black"
                v-bind:value="articlename"
                v-on:input="articlename = $event.target.value"
              />
              <input
                placeholder="Preis (9,99€ = 999)"
                style="margin: 10px; border: solid 1px black"
                v-bind:value="price"
                v-on:input="price = $event.target.value"
              />
              <input
                placeholder="Hersteller"
                style="margin: 10px; border: solid 1px black"
                v-bind:value="hersteller"
                v-on:input="hersteller = $event.target.value"
              />
              <input
                placeholder="Kategorie"
                style="margin: 10px; border: solid 1px black"
                v-bind:value="kategorie"
                v-on:input="kategorie = $event.target.value"
              />
              <div>
                <img
                  v-bind:src="images[imageCounter]"
                  style="width: 100%; max-width: 500px"
                />
              </div>
              <div style="margin: 4%">
                <v-btn @click="imageLeft">left</v-btn>
                <v-btn @click="imageRight">right</v-btn>
                <v-btn @click="deleteImage">Bild löschen</v-btn>
              </div>
            </div>

            <div v-else>
              <div>
                <img
                  v-bind:src="images[imageCounter]"
                  style="width: 100%; max-width: 500px"
                />
              </div>
              <div>
                <v-btn @click="imageLeft">Links</v-btn>
                <v-btn @click="imageRight">Rechts</v-btn>

                <h2>{{ price / 100 }}€</h2>
                <v-btn @click="addToCart" style="margin-top: 10px"
                  >In den Warenkorb legen</v-btn
                >
              </div>
            </div>
          </center>
        </td>
      </tr>
    </table>

    <center>
      <textarea
        v-if="this.addArticle"
        placeholder="Details"
        style="width: 80%; height: 300px; border: solid 1px black"
        v-bind:value="details"
        v-on:input="details = $event.target.value"
      >
      </textarea>
      <textarea
        v-else-if="this.edit"
        placeholder="Details"
        style="width: 80%; height: 300px; border: solid 1px black"
        v-bind:value="details"
        v-on:input="details = $event.target.value"
      >
      </textarea>
      <div v-else style="margin-bottom: 4%">
        <table
          border="1"
          width="70%"
          cellspacing="0"
          cellpadding="5"
          summary="Layout"
          style="margin-top: 2%"
        >
          <tr>
            <th>Details</th>
          </tr>
          <tr v-for="item in details" v-bind:key="item.key">
            <td>
              <p>{{ item.key }} : {{ item.value }}</p>
            </td>
          </tr>
        </table>
      </div>
    </center>
  </div>
</template>

<script lang="js">
//<b-table striped hover :items="items"></b-table>
import ArticleService from "@/catalogService/services/article.service.js"
import UploadImages from "vue-upload-drop-images"
export default {
  name: "Article",
  data() {
    return {
        article: "",
        articleId: -1,
        details: "",
        articleNr: "",
        addArticle: false,
        edit: false,

        images: [],
        price: "",
        articlename: "",
        description: "",
        hersteller: "",
        kategorie: "",
        imageIds: [],
        mutex: false,
        imageCounter: 0,

        deleteImageIds: [],
        newImages: [],
    }

  },
  async created()
    {
      if (this.$route.query.article == "add" && this.$store.state.userRole == "Admin")
      {
        this.addArticle = true;
      }
      else if (this.$route.query.article == "edit" && this.$store.state.userRole == "Admin")
      {
        this.edit = true;
      }
      if (!this.addArticle)//else
      {
        try
        {
          var response = "";
          if(this.edit)
          {
            response = await ArticleService.getArticle(this.$route.query.id);
          }
          else
          {
            response = await ArticleService.getArticle(this.$route.query.article);
          }
          this.articleId = response["data"]["_id"]
          response = response["data"];
          this.article = response.data;
          this.hersteller = this.article.hersteller;
          if(this.edit)
          {
            var tempStr = "";
            for(var detail of this.article["details"])
            {
              tempStr += detail["key"];
              tempStr += ":";
              tempStr += detail["value"];
              tempStr += "\n";
            }
            tempStr = tempStr.slice(0, -1);
            this.details = tempStr;
            this.kategorie = this.article.kategorie;
          }
          else
          {
            this.details = this.article["details"];
          }
          this.price = this.article["price"];
          this.articlename = this.article["articlename"];
          this.description = this.article["description"];
          if(this.edit)
          {
            this.description = this.description.substring(1);
          }
          this.imageIds = this.article["pictures"];
          for (let i = 0; i < this.imageIds.length; i++)
          {
            var id = this.imageIds[i];
            const response = await ArticleService.getPicture(id);
            this.images.push(response["data"]["data"]);
          }
        }
        catch(e)
        {
          console.log(e);
        }
      }
  },
  components: {
    UploadImages,
  },
  watch: {
    $route(to, from)
    {
      if(from["fullPath"] == "/article?article=add")
      {
        this.$router.go(this.$router.currentRoute)
      }
      if(this.$route.query.article == "edit")
      {
        this.$router.go(this.$router.currentRoute)
      }
      if(from["query"]["article"] == "edit")
      {
        this.$router.go(this.$router.currentRoute)
      }
    }
  },
  methods: {
    clickMethod()
    {
      this.$router.push('about');
    },
    imageLeft()
    {
      if(this.imageCounter - 1 >= 0)
      {
        this.imageCounter -= 1;
      }
    },
    imageRight()
    {
      if(this.imageCounter +1 != this.images.length)
      {
        this.imageCounter += 1;
      }
    },
    deleteImage()
    {
      let currentId = this.imageIds[this.imageCounter];
      this.deleteImageIds.push(currentId);
      this.images.splice(this.imageCounter, 1);
      this.imageIds.splice(this.imageCounter, 1);
      if(this.imageCounter > 0)
      {
        this.imageCounter -= 1;
      }
    },
    handleImages(files)
    {
      if(!this.edit)
      {
        this.images = files;
      }
      else
      {
        this.newImages = files;
      }
    },

    async handleImages2(arr)
    {
      for(var data of arr)
      {
        await this.uploadImage(data);
      }
    },


    async encodeToBase64(files)
    {
      var attach = [];
      var reader = [];
      // loop through each of the files in q-uploader
      for (let i = 0; i < files.length; i++)
      {
        attach[i] = await this.singleFileToBase64(i, files, reader)
      }
      // returns an array of all the files in base64 format
      return attach;
    },

    singleFileToBase64(i, files, reader)
    {
      reader[i] = new FileReader();
      // read the file into a base64 format
      reader[i].readAsDataURL(files[i]);

      return new Promise((resolve, reject) =>
      {
        reader[i].onerror = () =>
        {
          reader[i].abort();
          reject("Error converting to Base64")
        };

        // return the base 64 string
        reader[i].onload = function ()
        {
            resolve(reader[i].result);
        };
      })
    },
    async save()
    {
      this.description = "\n" + this.description;
      this.imageIds = [];
      var articleJson = {};
      articleJson["articlename"] = this.articlename;
      articleJson["price"] = Number(this.price);
      articleJson["description"] = this.description;
      articleJson["hersteller"] = this.hersteller;
      articleJson["kategorie"] = this.kategorie;
      var detailsJson = []
      var detailsSplit = this.details.split("\n");
      for (const line in detailsSplit)
      {
        var current = {}
        var keyValue = detailsSplit[line].split(":");
        var key = keyValue[0];
        var value = keyValue[1];
        current["key"] = key;
        current["value"] = value;
        detailsJson.push(current);
      }
      articleJson["details"] = detailsJson;
      var base64Array = await this.encodeToBase64(this.images);
      await this.handleImages2(base64Array);
      articleJson["pictures"] = this.imageIds;
      const response = await ArticleService.uploadArticle(articleJson);
      this.$router.push({name: 'Article', params: {articleId: event.target.id},  query: { article: response["data"] } });
    },
    async editArticleSave()
    {
      var articleJson = {};
      for(let imageId of this.deleteImageIds)
      {
        var result = await ArticleService.deletePicture(imageId);
        if(result.status != 200)
        {
          console.err(result.data);
          return;
        }
      }
      if(this.newImages.length > 0)
      {
        var base64Array = await this.encodeToBase64(this.newImages);
        await this.handleImages2(base64Array);
      }
      this.description = "\n" + this.description;
      articleJson["pictures"] = this.imageIds;
      articleJson["articlename"] = this.articlename;
      articleJson["price"] = Number(this.price);
      articleJson["description"] = this.description;
      articleJson["hersteller"] = this.hersteller;
      articleJson["kategorie"] = this.kategorie;
      var detailsJson = []
      var detailsSplit = this.details.split("\n");
      for (const line in detailsSplit)
      {
        var current = {}
        var keyValue = detailsSplit[line].split(":");
        var key = keyValue[0];
        var value = keyValue[1];
        current["key"] = key;
        current["value"] = value;
        detailsJson.push(current);
      }
      articleJson["details"] = detailsJson;
      await ArticleService.changeArticle(articleJson, this.articleId);
      this.$router.push({name: 'Article', params: {articleId: event.target.id},  query: { article: this.articleId } });
    },
    async uploadImage(data)
    {
      const response = await ArticleService.uploadImage(data);
      this.imageIds.push(response["data"]);
      return response["data"];
    },
    async addToCart()
    {
      var json = {};
      json["article_name"] = this.articlename;
      json["article_vendor"] = this.hersteller;
      json["article_price"] = parseFloat(this.price)/100;
      json["article_url"] = "http://35.246.128.219:3000/getArticle/" + this.articleId;
      json["article_imagepath"] = "http://35.246.128.219:3000/getPicture/" + this.imageIds[0];
      var userId = this.$store.state.userId;
      var response = await ArticleService.addToCart(userId, json);
      console.log(response);
      // Update article count badge
      this.$store.commit("incrementCartArticleCount");
    },
    async deleteArticle()
    {
      for(var pictureId of this.imageIds)
      {
        await ArticleService.deletePicture(pictureId);
      }
      await ArticleService.deleteArticle(this.articleId);
      this.$router.push({name: "CatalogView"});
    },
    async editArticle()
    {
      this.$router.push({name: 'Article', query: { article: 'edit', id: this.articleId } });
    },
  }
};
</script>
