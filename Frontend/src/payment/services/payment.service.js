import axios from "axios";

class PaymentService {
  constructor() {}

  async createInvoiceAndPay(invoice, amount) {
    console.log(`${process.env.VUE_APP_PAYMENT_SERVICE_URL}/api/Payment`);
    return await axios.post(
      `${process.env.VUE_APP_PAYMENT_SERVICE_URL}/api/Payment`,
      {
        invoice,
        amount,
      }
    );
  }
}

export default new PaymentService();
