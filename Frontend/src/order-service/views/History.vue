<template>
  <v-expansion-panels>
    <v-expansion-panel
      v-for="(order, index) in orders" :key="index" 
    >
      <v-expansion-panel-header>
        {{order.date}}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        
         <div v-for="(product, index) in order.products" :key="index" class="d-flex justify-center mb-6">
            <v-card class="d-flex justify-space-between align-center" height="50" width="900">
              <v-img
                max-height="50"
                max-width="50"
                v-bind:src="product.image"
              ></v-img>
              <strong class="pa-2">{{product.name}}</strong>
              <strong class="pa-2">{{product.count}}</strong>
              <strong class="pa-2">{{product.price}}€ </strong>
            </v-card>
         </div>

        <v-container class="d-flex justify-center mb-6">
          <strong>Gesamtpreis: {{order.total}}€</strong>
        </v-container>
       
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>


<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        e1: 1,
        orders: [],
      }
    },
    methods: {
      calculateTotalAmount: function () {
        let total = 0;
        this.orders.forEach(order => {
          order.products.forEach(product => {
            order.total += product.price * product.count
          });
          this.totalAmount = total
        })
      },
      async getOrders() {
      await axios
        .get('http://127.0.0.1:8000/api/v1/getOrders/123/')
        .then(response => {
          this.orders = JSON.parse(response.data);
          console.log(response.data)
          this.calculateTotalAmount()
        })
        .catch(error => {
          console.log(error)
        })
      },
    },
    beforeMount(){
      this.getOrders()
    },
  }
</script>