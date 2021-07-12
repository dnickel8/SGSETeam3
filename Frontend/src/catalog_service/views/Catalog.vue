<template>
  <Catalog />
</template>

<script>
// @ is an alias to /src
import Catalog from "@/catalog_service/components/catalog.vue";

export default {
  name: "CatalogView",
  components: {
    Catalog,
  },
};
</script>
