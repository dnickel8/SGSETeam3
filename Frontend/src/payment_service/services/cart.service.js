import axios from "axios";

class CartService {
  constructor() {}

  async deletePassedArticles(articlesToDelete, userId) {
    return await axios.delete(
      `${process.env.VUE_APP_CART_SERVICE_URL}/cart/deletePassedArticles/${userId}`,
      {
        data: {
          articles: articlesToDelete,
        },
      }
    );
  }
}

export default new CartService();
