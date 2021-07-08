import axios from "axios";

class OrderService {
  constructor() {}

  async placeOrder(order) {
    return await axios.post(
      `${process.env.VUE_APP_ORDER_SERVICE_URL}/placeOrder/`,
      order
    );
  }
}

export default new OrderService();
