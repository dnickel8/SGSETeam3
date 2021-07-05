import Vue from "vue";
import VueRouter from "vue-router";
import Cart from "../cartservice/views/Cart.vue";
import WishList from "../cartservice/views/WishList";
import Payment from "../payment/views/Payment.vue";
import Order from "../order-service/views/Order";
import History from "../order-service/views/History";
import Catalog from "../catalogService/views/Catalog.vue";
import CatalogSearch from "../catalogService/views/CatalogSearch.vue";
import Article from "../catalogService/views/Article.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "CatalogView",
    component: Catalog,
    meta: {
      title: "Hauptseite",
    },
  },
  {
    path: "/catalogSearch",
    name: "CatalogSearchView",
    component: CatalogSearch,
    meta: {
      title: "Produktsuche",
    },
  },
  {
    path: "/article",
    name: "Article",
    component: Article,
    meta: {
      title: "Produktseite",
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
