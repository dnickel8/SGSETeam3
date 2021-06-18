<template>
  <div>
    <h3>Payment</h3>
    Payment Component is working!
    <div>{{ test }}</div>
  </div>
</template>

<script lang="js">
import PaymentService from "@/payment/services/payment.service.js"
export default {
  name: "Payment",
  data() {
    return {
        test: {},
    }
  },
  async created() {
    try {
      const response = await PaymentService.test();
      console.log(response);
      this.test = response.data[0];
    } catch(e) {
      console.log(e);
    }
  }
};
</script>

<style>
h3 {
  color: #000;
}
</style>
