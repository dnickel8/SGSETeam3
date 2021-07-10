import axios from "axios";

class ArticleService {
  constructor() {}

  async getArticle(id) {
    return await axios.get(
      `${process.env.VUE_APP_CATALOG_SERVICE_URL}/getArticle/` + id + "/"
    );
  }
  async uploadImage(base64) {
    return await axios({
      method: "post",
      url: `${process.env.VUE_APP_CATALOG_SERVICE_URL}/createPicture/`,
      data: {
        data: base64,
      },
    });
  }

  async uploadArticle(articleJson) {
    return await axios({
      method: "post",
      url: `${process.env.VUE_APP_CATALOG_SERVICE_URL}/createArticle/`,
      data: {
        data: articleJson,
      },
    });
  }

  async changeArticle(articleJson, id) {
    return await axios({
      method: "put",
      url:
        `${process.env.VUE_APP_CATALOG_SERVICE_URL}/changeArticle/` + id + "/",
      data: {
        data: articleJson,
      },
    });
  }

  async getPicture(id) {
    return await axios.get(
      `${process.env.VUE_APP_CATALOG_SERVICE_URL}/getPicture/` + id + "/"
    );
  }

  async deletePicture(id) {
    return await axios.delete(
      `${process.env.VUE_APP_CATALOG_SERVICE_URL}/deletePicture/` + id + "/"
    );
  }

  async deleteArticle(id) {
    return await axios.delete(
      `${process.env.VUE_APP_CATALOG_SERVICE_URL}/deleteArticle/` + id + "/"
    );
  }

  async addToCart(userId, bodyData) {
    return await axios({
      method: "post",
      url:
        `${process.env.VUE_APP_CART_SERVICE_URL}/cart/addArticle/` +
        userId +
        "/",
      data: bodyData,
    });
  }
}

export default new ArticleService();
