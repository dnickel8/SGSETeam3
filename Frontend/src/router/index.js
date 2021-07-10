import Vue from "vue";
import VueRouter from "vue-router";
import Cart from "../cartservice/views/Cart.vue";
import WishList from "../cartservice/views/WishList";
import Order from "../order-service/views/Order";
import History from "../order-service/views/History";
import Catalog from "../catalogService/views/Catalog.vue";
import CatalogSearch from "../catalogService/views/CatalogSearch.vue";
import Article from "../catalogService/views/Article.vue";
import Account from "../accountservice/views/Account.vue";

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
      requiresAuth: true,
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
  {
    path: "/account",
    component: Account,
    name: "account",
    meta: {
      title: "Benutzermanagement",
    },
  },
];

const router = new VueRouter({
  mode: "hash",
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
