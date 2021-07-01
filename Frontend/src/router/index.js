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
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/payment",
    name: "PaymentView",
    component: Payment,
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
