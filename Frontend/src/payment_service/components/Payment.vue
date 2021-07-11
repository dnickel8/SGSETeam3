<template>
  <v-container fill-height fluid>
    <div style="width: 100%" justify="center" align="center">
      <v-overlay :value="alert">
        <v-alert
          @input="alert = false"
          dense
          dismissible
          elevation="12"
          type="success"
          >Die Bestellung wurde erfolgreich durchgeführt!</v-alert
        >
      </v-overlay>
      <v-row justify="center">
        <v-sheet class="pa-8" color="white" elevation="8" rounded
          ><h3 class="ma-3">Express Checkout</h3>
          <div id="paypal-buttons"></div
        ></v-sheet>
      </v-row>
      <v-row class="pa-7" align="center">
        <v-divider></v-divider>OR<v-divider></v-divider>
      </v-row>
      <v-row class="d-flex justify-center mb-6">
        <v-form ref="form" v-model="valid">
          <v-row outlined justify="center">
            <h2>Bezahlen auf Rechnung</h2>
          </v-row>
          <v-row outlined justify="center">
            <h3>Kontaktinformation</h3>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" sm="12"
              ><v-text-field
                v-model="fields.email"
                :rules="emailRules"
                label="Email"
                required
                solo
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row justify="center"><h3>Rechnungsadresse</h3></v-row>
          <v-row justify="center"
            ><v-radio-group v-model="sameAsDeliveryAddress" row>
              <v-radio label="Wie die Lieferadresse" :value="true"></v-radio>
              <v-radio
                label="Andere Adresse"
                :value="false"
              ></v-radio> </v-radio-group
          ></v-row>

          <template v-if="!sameAsDeliveryAddress">
            <v-row justify="center">
              <v-col cols="12" sm="6"
                ><v-text-field
                  v-model="fields.firstname"
                  :rules="fieldRules"
                  label="Vorname"
                  required
                  solo
                ></v-text-field
              ></v-col>
              <v-col cols="12" sm="6"
                ><v-text-field
                  v-model="fields.surname"
                  :rules="fieldRules"
                  label="Nachname"
                  required
                  solo
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="5"
                ><v-text-field
                  v-model="fields.street"
                  :rules="fieldRules"
                  label="Straße und Hausnummer"
                  required
                  solo
                ></v-text-field
              ></v-col>
              <v-col cols="3"
                ><v-text-field
                  v-model="fields.postalCode"
                  :rules="fieldRules"
                  label="PLZ"
                  required
                  solo
                ></v-text-field
              ></v-col>
              <v-col cols="4"
                ><v-text-field
                  v-model="fields.city"
                  :rules="fieldRules"
                  label="Stadt"
                  required
                  solo
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row justify="center"> </v-row>
            <v-row justify="center">
              <v-col cols="12"
                ><v-text-field
                  v-model="fields.phone"
                  :rules="fieldRules"
                  label="Telefon"
                  required
                  solo
                ></v-text-field
              ></v-col>
            </v-row>
          </template>
          <v-btn
            :disabled="!valid || (!sameAsDeliveryAddress && checkEmailRules())"
            color="primary"
            class="mr-4"
            @click="createInvoiceAndPay"
          >
            Zahlungspflichtig bestellen
          </v-btn>
        </v-form>
      </v-row>
    </div>
    <v-btn text @click="changeStep(2)"> Zurück </v-btn>
  </v-container>
</template>

<script lang="js">
import PaymentService from "@/payment_service/services/payment.service.js"
import OrderService from "@/payment_service/services/order.service.js"
import CartService from "@/payment_service/services/cart.service.js"
import { loadScript } from "@paypal/paypal-js";
export default {
  name: "Payment",
  props: ["address", "items", "totalAmount"],
  data() {
    return {
        sameAsDeliveryAddress: true,
        alert: false,
        valid: false,
        fields: {
          email: '',
          firstname: '',
          surname: '',
          street: '',
          postalCode: '',
          city: '',
          phone: '',
          countryCode: ''
        },
        fieldRules: [
        v => !!v || 'Das Feld ist erforderlich',
        ],
        emailRules: [
        v => !!v || 'Eine E-Mail Adresse ist erforderlich',
        v => /.+@.+/.test(v) || 'Die E-Mail Adresse ist nicht zulässig',
      ],

    }
  },
  async mounted() {
    const me = this;
    const paypalSdk = await loadScript({
      "client-id":
        "ASchRjlk4vOH0uRd5BwQ3Lt408sw_7wydEShg63KSyxkA5tVrIWRyJhSWZc8Ig8TFXRVRVEan3d6Ufe4",
      currency: "EUR",
      "disable-funding": "giropay,sepa,sofort,card"
    });
    paypalSdk.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: me.totalAmount
            }
          }]
        })
      },
      onApprove: function(data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(async function(details) {
          const invoice = me.createInvoiceWithPaypalData(details);
          const amount = me.createAmountWithPaypalData(details.purchase_units[0].amount);
          await PaymentService.createInvoiceAndPay(invoice, amount, true);
          me.alert = true;
          await me.placeOrderAndDeleteArticlesInCart(invoice, amount, "PayPal");
          me.$router.push({ name: "OrderHistory" });
    });
    }
    }).render("#paypal-buttons");
  },
  methods: {
    checkEmailRules() {
      if (this.emailRules[0] === true && this.emailRules[0] === true) {
        return true;
      }
      return false;
    },
    async createInvoiceAndPay() {
      const invoice = this.createInvoice();
      const amount = this.createAmount();
      await PaymentService.createInvoiceAndPay(invoice, amount, false);
      this.alert = true;
      await this.placeOrderAndDeleteArticlesInCart(invoice, amount, "Rechnung");
      this.$router.push({ name: "OrderHistory" });


    },
    async placeOrderAndDeleteArticlesInCart(invoice, amount, shippingMethod) {
      const order = OrderService.createOrder(invoice, amount, shippingMethod, this.address, this.$store.state.userId, this.items);
      await OrderService.placeOrder(order);
      const articlesToDelete = this.createArticlesToDelete();
      await CartService.deletePassedArticles(articlesToDelete, this.$store.state.userId);
    },
    createAmount() {
      const amount = {
        currencyCode: "EUR",
        value: this.totalAmount
      }
      return amount;
    },
    createInvoice() {
      const invoice = {
        invoiceDetails: {
          invoiceNumber: null,
          invoiceDate: new Date(),
          currencyCode: "EUR",
          note: null,
          dueDate: new Date(),
        },
        recipient: {
          firstName: this.address.first_name,
          surname: this.address.last_name,
          address: {
            street: this.address.street + " " + this.address.number,
            postalCode: this.address.code,
            city: this.address.city,
            countryCode: "DE",
          },
          emailAddress: this.fields.email,
          phoneNumber: this.fields.phone,
          shippingInfo: {
            firstName: this.sameAsDeliveryAddress ? this.address.first_name : this.fields.firstname,
            surname: this.sameAsDeliveryAddress ? this.address.last_name : this.fields.surname,
            address: {
              street: this.sameAsDeliveryAddress ? this.address.street + " " + this.address.number : this.fields.street,
              postalCode: this.sameAsDeliveryAddress ? this.address.code : this.fields.postalCode,
              city: this.sameAsDeliveryAddress ? this.address.city : this.fields.city,
              countryCode: "DE"
            }
          }
        },
        items: this.createItems()
      }

      return invoice;
    },
    createInvoiceWithPaypalData(details) {
      const invoice = {
        invoiceDetails: {
          invoiceNumber: null,
          invoiceDate: new Date(),
          currencyCode: "EUR",
          note: null,
          dueDate: new Date(),
        },
        recipient: {
          firstName: details.payer.name.given_name,
          surname: details.payer.name.surname,
          address: {
            street: details.purchase_units[0].shipping.address.address_line_1,
            postalCode: details.purchase_units[0].shipping.address.postal_code,
            city: details.purchase_units[0].shipping.address.admin_area_2,
            countryCode: details.purchase_units[0].shipping.address.country_code,
          },
          emailAddress: details.payer.email_address,
          phoneNumber: null,
          shippingInfo: {
            firstName: details.payer.name.given_name,
            surname: details.payer.name.surname,
            address: {
              street: details.purchase_units[0].shipping.address.address_line_1,
              postalCode: details.purchase_units[0].shipping.address.postal_code,
              city: details.purchase_units[0].shipping.address.admin_area_2,
              countryCode: details.purchase_units[0].shipping.address.country_code,
            }
          }
        },
        items: this.createItems()
      }

      return invoice;
    },
    createAmountWithPaypalData(amount) {
      const createdAmount = {
        currencyCode: amount.currency_code,
        value: amount.value
      }
      return createdAmount;
    },
    createItems() {
      const paymentItems = []
      this.items.forEach(item => {
        const paymentItem = {
          name: item.article_name,
          description: "",
          quantity: item.article_count,
          discount: 0,
          tax: 0,
          amount: {
            currencyCode: "EUR",
            value: item.article_price
          }
        };
        paymentItems.push(paymentItem);
      });
      return paymentItems;
    },
    changeStep(stepNumber) {
      this.$emit("changeStep", stepNumber);
    },
    createArticlesToDelete() {
      const articles = [];
      this.items.forEach((element) => {
        articles.push(element.article_id);
      });
      return articles;
    }
  }


};
</script>
