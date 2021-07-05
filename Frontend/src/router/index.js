import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Cart from "../cartservice/views/Cart.vue";
import WishList from "../cartservice/views/WishList";
import Payment from "../payment/views/Payment.vue";
import Order from "../order-service/views/Order";
import History from "../order-service/views/History";

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
    name: "order",
    component: Order,
    meta: {
      title: "Bestellvorgang",
    },
  },
  {
    path: "/history",
    name: "orderhistory",
    component: History,
    meta: {
      title: "Bestellungen",
    },
  },
  {
    path: "/payment",
    name: "payment",
    component: Payment,
    meta: {
      title: "Bezahlvorgang",
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
