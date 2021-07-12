import axios from "axios";

class OrderService {
  constructor() {}

  async placeOrder(order) {
    return await axios.post(
      `${process.env.VUE_APP_ORDER_SERVICE_URL}/api/v1/placeOrder/`,
      order
    );
  }

  createOrder(invoice, amount, shippingMethod, address, userId, items) {
    const order = {
      date: invoice.invoiceDetails.invoiceDate,
      user: {
        id: userId,
      },
      products: items,
      address: {
        firstName: address.first_name,
        lastName: address.last_name,
        street: address.street,
        number: address.number,
        postCode: address.code,
        city: address.city,
      },
      shippingAddress: {
        firstName: invoice.recipient.shippingInfo.firstName,
        lastName: invoice.recipient.shippingInfo.surname,
        street: invoice.recipient.shippingInfo.address.street.split(" ")[0],
        number: invoice.recipient.shippingInfo.address.street.split(" ")[1],
        postCode: invoice.recipient.shippingInfo.address.postalCode,
        city: invoice.recipient.shippingInfo.address.city,
      },
      shippingMethod: {
        name: shippingMethod,
        description: shippingMethod,
        price: parseFloat(amount.value),
      },
    };
    return order;
  }
}

export default new OrderService();
