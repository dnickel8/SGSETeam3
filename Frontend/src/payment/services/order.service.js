import axios from "axios";

class OrderService {
  constructor() {}

  async placeOrder(order) {
    return await axios.post(
      `${process.env.VUE_APP_ORDER_SERVICE_URL}/placeOrder/`,
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
        firstName: invoice.invoiceDetails.recipient.shippingInfo.firstName,
        lastName: invoice.invoiceDetails.recipient.shippingInfo.surname,
        street:
          invoice.invoiceDetails.recipient.shippingInfo.address.street.split(
            " "
          )[0],
        number:
          invoice.invoiceDetails.recipient.shippingInfo.address.street.split(
            " "
          )[1],
        postCode:
          invoice.invoiceDetails.recipient.shippingInfo.address.postalCode,
        city: invoice.invoiceDetails.recipient.shippingInfo.address.city,
      },
      shippingMethod: {
        name: shippingMethod,
        description: shippingMethod,
        price: amount.value,
      },
    };
    return order;
  }
}

export default new OrderService();
