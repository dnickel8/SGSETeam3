import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Cart from "../cartservice/views/Cart.vue";
import Payment from "../views/Payment.vue";
import WishList from "@/cartservice/views/WishList";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "Hauptseite",
    },
  },
  {
    path: "/order",
    name: "Order",
    component: () =>
      import(/* webpackChunkName: "about" */ "../order-service/views/Order.vue"),
  },
  {
    path: "/history",
    name: "Order History",
    component: () =>
      import(/* webpackChunkName: "about" */ "../order-service/views/History.vue"),
  },
  {
    path: "/payment",
    name: "PaymentView",
    component: Payment,
    meta: {
      title: "Bezahlung",
    },
  },
  {
    path: "/cart",
    component: Cart,
    name: "cart",
    meta: {
      title: "Warenkorb",
    },
  },
  {
    path: "/wishlist",
    component: WishList,
    name: "wishlist",
    meta: {
      title: "Wunschliste",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

const DEFAULT_TITLE = "MicroShop";
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;