<template>
  <Catalog />
</template>

<script>
// @ is an alias to /src
import Catalog from "@/catalogService/components/catalog.vue";

export default {
  name: "CatalogView",
  components: {
    Catalog,
  },
};
</script>
