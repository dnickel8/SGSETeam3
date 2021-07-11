<template>
  <div class="d-flex justify-center mb-6">
    <div v-if="showNoContentMessage" class="text-h6 mb-8">
      Keine Bestellungen vorhanden
    </div>
    <v-expansion-panels v-if="!showNoContentMessage">
      <v-expansion-panel v-for="(order, index) in orders" :key="index">
        <v-expansion-panel-header>
          {{ getDate(order) }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
            v-for="(product, index) in order.products"
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
                v-bind:src="product.article_imagepath"
              ></v-img>
              <strong class="pa-2">{{ product.article_name }}</strong>
              <strong class="pa-2">{{ product.article_count }}</strong>
              <strong class="pa-2">{{ product.article_price }}€ </strong>
            </v-card>
          </div>

          <v-container class="d-flex justify-center mb-6">
            <strong>Gesamtpreis: {{ order.total }}€</strong>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      user_id: 123,
      e1: 1,
      orders: [],
      showNoContentMessage: true,
    };
  },
  methods: {
    getDate(order) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const date = new Date(order.date).toLocaleDateString("de-DE", options);
      return date;
    },
    calculateTotalAmount: function () {
      let total = 0;
      this.orders.forEach((order) => {
        order.total = 0;
        order.products.forEach((product) => {
          order.total += product.article_price * product.article_count;
        });
        this.totalAmount = total;
      });
    },
    async getOrders() {
      let url =
        process.env.VUE_APP_ORDER_SERVICE_URL +
        "/api/v1/getOrders/" +
        this.user_id;
      await axios
        .get(url)
        .then((response) => {
          if (response.status === 200) {
            this.orders = JSON.parse(response.data);
            if (this.orders.length !== 0) {
              this.showNoContentMessage = false;
              this.calculateTotalAmount();
            }
          }
        })
        .catch(() => {});
    },
  },
  async mounted() {
    this.user_id = this.$store.state.userId;
    await this.getOrders();
  },
};
</script>
