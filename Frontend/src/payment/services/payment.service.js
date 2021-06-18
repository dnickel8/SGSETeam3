import axios from "axios";

class PaymentService {
  constructor() {}

  async test() {
    return await axios.get("http://jsonplaceholder.typicode.com/posts");
  }
}

export default new PaymentService();
