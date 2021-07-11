import Vue from "vue";
import VueRouter from "vue-router";

import Cart from "../cart_service/views/Cart.vue";
import WishList from "../cart_service/views/WishList";
import Order from "../order_service/views/Order";
import History from "../order_service/views/History";
import Catalog from "../catalog_service/views/Catalog.vue";
import CatalogSearch from "../catalog_service/views/CatalogSearch.vue";
import Article from "../catalog_service/views/Article.vue";
import Account from "../account_service/views/Account.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Catalog",
    component: Catalog,
    meta: {
      title: "Produkte",
    },
  },
  {
    path: "/catalog/search",
    name: "CatalogSearch",
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
    name: "Order",
    component: Order,
    meta: {
      title: "Bestellvorgang",
      requiresAuth: true,
    },
  },
  {
    path: "/history",
    name: "OrderHistory",
    component: History,
    meta: {
      title: "Bestellungen",
      requiresAuth: true,
    },
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: {
      title: "Warenkorb",
      requiresAuth: true,
    },
  },
  {
    path: "/wishlist",
    name: "Wishlist",
    component: WishList,
    meta: {
      title: "Merkliste",
      requiresAuth: true,
    },
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
    meta: {
      title: "Mein Konto",
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.VUE_APP_FRONTEND_URL,
  routes,
});

const DEFAULT_TITLE = "MicroShop";
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    while (router.app.$keycloak.createLoginUrl === null) {
      await sleep(100);
    }
    if (router.app.$keycloak.authenticated) {
      next();
    } else {
      router.app.$keycloak.login();
    }
  } else {
    next();
  }
});

export default router;
