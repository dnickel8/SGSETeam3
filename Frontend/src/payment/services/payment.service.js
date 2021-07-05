import axios from "axios";

class PaymentService {
  constructor() {}

  async createInvoiceAndPay(invoice, amount) {
    return await axios.post("https://localhost:5001/api/Payment", {
      invoice,
      amount,
    });
  }
}

export default new PaymentService();
