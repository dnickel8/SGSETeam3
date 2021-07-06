<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1"> Versand </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2"> Übersicht </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3"> Zahlung </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-container>
          <v-row class="d-flex justify-center mb-6">
            <h2>Versandart</h2>
          </v-row>
          <v-row class="d-flex justify-center mb-6">
            <v-radio-group v-model="radios">
              <v-radio value="Standard">
                <template v-slot:label>
                  <div>
                    <strong>DHL-Standard </strong><br />
                    <span>Lieferzeit: 1-3 Werktage</span>
                  </div>
                </template>
              </v-radio>
              <v-radio value="Express">
                <template v-slot:label>
                  <div>
                    <strong>DHL-Express </strong><br />
                    <span>Lieferzeit: 1 Werktag</span>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-row>
          <v-row class="d-flex justify-center mb-6">
            <h2>Adresse</h2>
          </v-row>
          <v-row class="d-flex justify-center mb-6">
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Vorname"
                      :rules="rules_text"
                      v-model="address.fist_name"
                      solo
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Nachname"
                      :rules="rules_text"
                      v-model="address.last_name"
                      solo
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Straße"
                      :rules="rules_text"
                      v-model="address.street"
                      solo
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Hausnummer"
                      :rules="rules_number"
                      v-model="address.number"
                      solo
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="PLZ"
                      :rules="rules_code"
                      v-model="address.code"
                      solo
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Stadt"
                      :rules="rules_text"
                      v-model="address.city"
                      solo
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-row>
        </v-container>

        <v-btn color="primary" @click="e1 = 2"> Weiter </v-btn>

        <v-btn text> Zurück </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <div
          v-for="(product, index) in products"
          :key="index"
          class="d-flex justify-center mb-6"
        >
          <v-card
            class="d-flex justify-space-between align-center"
            height="50"
            width="900"
          >
            <v-img
              max-height="50"
              max-width="50"
              v-bind:src="product.image"
            ></v-img>
            <strong class="pa-2">{{ product.name }}</strong>
            <v-col cols="6" sm="6" md="1">
              <v-row class="align-center">
                <v-text-field
                  :rules="rules_number"
                  v-model="product.count"
                  @change="calculateTotalAmount"
                ></v-text-field>
              </v-row>
            </v-col>
            <strong>{{ product.price }}€</strong>
            <v-btn text> Entfernen </v-btn>
          </v-card>
        </div>

        <v-container class="d-flex justify-center mb-6">
          <strong>Gesamtpreis: {{ totalAmount }}€</strong>
        </v-container>

        <v-btn color="primary" @click="e1 = 3"> Weiter </v-btn>

        <v-btn text @click="e1 = 1"> Zurück </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <Payment
          :items="products"
          :address="address"
          @changeStep="onChangeStep"
        />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import Payment from "@/payment/components/Payment.vue";
export default {
  components: {
    Payment,
  },
  data() {
    return {
      e1: 1,
      products: [
        {
          name: "Mikrofon",
          image: "https://picsum.photos/50/50",
          count: 1,
          price: 100,
        },
        {
          name: "Mikrofonarm",
          image: "https://picsum.photos/50/50",
          count: 1,
          price: 22,
        },
        {
          name: "Kabel",
          image: "https://picsum.photos/50/50",
          count: 2,
          price: 9,
        },
      ],
      address: {
        first_name: "",
        last_name: "",
        street: "",
        number: "",
        code: "",
        city: "",
      },
      radios: "Standard",
      rules_text: [
        (value) => !!value || "Pflichtfeld",
        (value) => (value && value.length >= 3) || "Min. 3 Zeichen",
      ],
      rules_number: [
        (value) => !!value || "Pflichtfeld",
        (value) => !isNaN(value) || "Bitte Zahlen verwenden",
      ],
      rules_code: [
        (value) => !!value || "Pflichtfeld",
        (value) => (value && value.length >= 3) || "Min. 3 Zeichen",
        (value) => !isNaN(value) || "Bitte Zahlen verwenden",
      ],
      totalAmount: "test",
    };
  },
  methods: {
    calculateTotalAmount: function () {
      let total = 0;
      this.products.forEach((product) => {
        total += product.price * product.count;
      });
      this.totalAmount = total;
    },
    onChangeStep(step) {
      this.e1 = step;
    },
  },
  beforeMount() {
    this.calculateTotalAmount();
  },
  watch: {
    products: {
      immediate: true,
      handler: function () {
        this.calculateTotalAmount();
      },
      deep: true,
    },
  },
};
</script>
