import axios from "axios";

class PaymentService {
  constructor() {}

  async createInvoiceAndPay(invoice, amount, payed) {
    return await axios.post(
      `${process.env.VUE_APP_PAYMENT_SERVICE_URL}/api/Payment?payed=${payed}`,
      {
        invoice,
        amount,
      }
    );
  }
}

export default new PaymentService();
