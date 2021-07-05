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

      <v-form ref="form" v-model="valid">
        <v-row outlined justify="center">
          <h2>Bezahlen auf Rechnung</h2>
        </v-row>
        <v-row outlined justify="center">
          <h3>Kontaktinformation</h3>
        </v-row>
        <v-row justify="center">
          <v-col cols="8"
            ><v-text-field
              v-model="fields.email"
              :rules="emailRules"
              label="Email"
              required
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row justify="center"><h3>Rechnungsadresse</h3></v-row>
        <v-row justify="center">
          <v-col cols="4"
            ><v-text-field
              v-model="fields.firstname"
              :rules="fieldRules"
              label="Vorname"
              required
            ></v-text-field
          ></v-col>
          <v-col cols="4"
            ><v-text-field
              v-model="fields.surname"
              :rules="fieldRules"
              label="Nachname"
              required
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="3"
            ><v-text-field
              v-model="fields.street"
              :rules="fieldRules"
              label="Straße und Hausnummer"
              required
            ></v-text-field
          ></v-col>
          <v-col cols="2"
            ><v-text-field
              v-model="fields.postalCode"
              :rules="fieldRules"
              label="PLZ"
              required
            ></v-text-field
          ></v-col>
          <v-col cols="3"
            ><v-text-field
              v-model="fields.city"
              :rules="fieldRules"
              label="Stadt"
              required
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row justify="center"> </v-row>
        <v-row justify="center">
          <v-col cols="4"
            ><v-select
              v-on:change="onSelect"
              v-model="fields.country"
              :rules="fieldRules"
              label="Land"
              :items="countries"
            ></v-select
          ></v-col>
          <v-col cols="4"
            ><v-text-field
              v-model="fields.phone"
              :rules="fieldRules"
              label="Telefon"
              required
            ></v-text-field
          ></v-col>
        </v-row>
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="createInvoiceAndPay"
        >
          Zahlungspflichtig bestellen
        </v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script lang="js">
import PaymentService from "@/payment/services/payment.service.js"
//import EmailService from "@/payment/services/email.service.js"
import { loadScript } from "@paypal/paypal-js";
export default {
  name: "Payment",
  data() {
    return {
        alert: false,
        valid: false,
        countries: ["Deutschland", "Frankreich", "Belgien", "Österreich"],
        fields: {
          email: '',
          firstname: '',
          surname: '',
          street: '',
          postalCode: '',
          city: '',
          country: '',
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
    const store = this.$store;
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
              value: store.state.orderAmount
            }
          }]
        })
      },
      onApprove: function(data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
          console.log(details);
          //createInvoiceWithPaypalData(details);
          // This function shows a transaction success message to your buyer.
          me.alert = true;
    });
    }
    }).render("#paypal-buttons");
  },
  methods: {
    onSelect(newValue) {
      switch (newValue) {
        case "Deutschland":
          this.fields.countryCode = "DE";
          break;
        case "Frankreich":
          this.fields.countryCode = "FR";
          break;
        case "Belgien":
          this.fields.countryCode = "BE";
          break;
        case "Österreich":
          this.fields.countryCode = "AT";
          break;
        default:
          this.fields.countryCode = "";
          break;
      }
    },
    validate () {
        this.$refs.form.validate()
      },
    async createInvoiceAndPay() {
      const invoice = this.createInvoice();
      const amount = this.createAmount();
      await PaymentService.createInvoiceAndPay(invoice, amount);
      this.alert = true;
      // EmailService.sendEmail(invoice.recipient.emailAddress);
    },
    createAmount() {
      const amount = {
        currencyCode: "EUR",
        value: this.$store.state.orderAmount
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
          firstName: this.fields.firstname,
          surname: this.fields.surname,
          address: {
            street: this.fields.street,
            postalCode: this.fields.postalCode,
            city: this.fields.city,
            countryCode: this.fields.countryCode,
          },
          emailAddress: this.fields.email,
          phoneNumber: this.fields.phone,
          shippingInfo: {
            firstName: this.fields.firstname,
            surname: this.fields.surname,
            address: {
              street: this.fields.street,
              postalCode: this.fields.postalCode,
              city: this.fields.city,
              countryCode: this.fields.countryCode
            }
          }
        },
        items: this.$store.state.items
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
            street: details.purchase_units.shipping.address.address_line_1,
            postalCode: details.purchase_units.shipping.address.postal_code,
            city: details.purchase_units.shipping.address.admin_area_2,
            countryCode: details.purchase_units.shipping.address.country_code,
          },
          emailAddress: details.payer.email_address,
          phoneNumber: this.fields.phone,
          shippingInfo: {
            firstName: this.fields.firstname,
            surname: this.fields.surname,
            address: {
              street: this.fields.street,
              postalCode: this.fields.postalCode,
              city: this.fields.city,
              countryCode: this.fields.countryCode
            }
          }
        },
        items: this.$store.state.items
      }

      return invoice;
    }
  }


};
</script>
