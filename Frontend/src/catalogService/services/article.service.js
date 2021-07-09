import axios from "axios";

class ArticleService {
  constructor() {}

  async getArticle(id) {
    return await axios.get("http://localhost:3000/getArticle/" + id + "/");
  }
  async uploadImage(base64) {
    return await axios({
      method: "post",
      url: "http://localhost:3000/createPicture/",
      data: {
        data: base64,
      },
    });
  }

  async uploadArticle(articleJson) {
    return await axios({
      method: "post",
      url: "http://localhost:3000/createArticle/",
      data: {
        data: articleJson,
      },
    });
  }

  async changeArticle(articleJson, id) {
    return await axios({
      method: "put",
      url: "http://localhost:3000/changeArticle/" + id + "/",
      data: {
        data: articleJson,
      },
    });
  }

  async getPicture(id) {
    return await axios.get("http://localhost:3000/getPicture/" + id + "/");
  }

  async deletePicture(id) {
    return await axios.delete(
      "http://localhost:3000/deletePicture/" + id + "/"
    );
  }

  async deleteArticle(id) {
    return await axios.delete(
      "http://localhost:3000/deleteArticle/" + id + "/"
    );
  }

  async addToCart(userId, bodyData) {
    return await axios({
      method: "post",
      url: "http://35.198.171.180:8000/cart/addArticle/" + userId + "/",
      data: bodyData,
    });
  }
}

export default new ArticleService();
