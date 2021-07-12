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
                      v-model="address.first_name"
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

        <v-btn color="primary" :disabled="!isAddressValid" @click="e1 = 2">
          Weiter
        </v-btn>

        <v-btn text> Zurück </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <div
          v-for="product in products"
          :key="product.article_id"
          class="d-flex justify-center mb-6"
        >
          <v-card
            class="d-flex justify-space-between align-center"
            height="50"
            width="900"
          >
            <v-img
              :src="product.article_imagepath"
              :eager="true"
              :width="50"
              :height="50"
              contain
              class="ma-3 article-image-hack"
            ></v-img>
            <strong class="pa-2">{{ product.article_name }}</strong>
            <v-col cols="6" sm="6" md="1">
              <v-row class="align-center">
                <v-text-field
                  :rules="rules_number"
                  v-model="product.article_count"
                  @change="calculateTotalAmount"
                ></v-text-field>
              </v-row>
            </v-col>
            <strong>{{ product.article_price }}€</strong>
            <v-btn
              text
              @click="removeProduct(product)"
              :disabled="!enableRemoveButtons"
            >
              Entfernen
            </v-btn>
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
          :totalAmount="totalAmount"
        />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import Payment from "@/payment_service/components/Payment.vue";

export default {
  components: {
    Payment,
  },
  data() {
    return {
      e1: 1,
      products: [],
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
      totalAmount: "",
      isAddressValid: false,
      enableRemoveButtons: true,
    };
  },
  methods: {
    calculateTotalAmount: function () {
      let total = 0;
      this.products.forEach((product) => {
        if (product.article_count < 1) {
          product.article_count = 1;
        }
        total += product.article_price * product.article_count;
      });
      this.totalAmount = total;
    },
    validateAddress: function () {
      if (
        this.address.first_name.length >= 3 &&
        this.address.last_name.length >= 3 &&
        this.address.street.length >= 3 &&
        this.address.code.length >= 3 &&
        this.address.city.length >= 3 &&
        !isNaN(this.address.number) &&
        !isNaN(this.address.code)
      ) {
        this.isAddressValid = true;
      }
    },
    removeProduct: function (product) {
      this.products = this.products.filter(
        (item) => item.article_id !== product.article_id
      );
      if (this.products.length === 1) {
        this.enableRemoveButtons = false;
      }
    },
    onChangeStep: function (step) {
      this.e1 = step;
    },
    async getImage(image_url) {
      return await this.axios.get(image_url);
    },
    async getAllImages() {
      for (let i = 0; i < this.products.length; ++i) {
        let image = await this.getImage(this.products[i].article_imagepath);
        if (image) {
          this.products[i].article_imagepath = image.data.data;
        } else {
          this.products[i].article_imagepath = "ERROR";
        }
      }
    },
  },
  watch: {
    products: {
      immediate: true,
      handler: function () {
        this.calculateTotalAmount();
      },
      deep: true,
    },
    address: {
      handler: function () {
        this.validateAddress();
      },
      deep: true,
    },
  },
  async mounted() {
    this.products = this.$store.state.products;
    await this.getAllImages();
    this.calculateTotalAmount();
  },
};
</script>

<style scoped>
.article-image-hack {
  flex: none;
}
</style>
