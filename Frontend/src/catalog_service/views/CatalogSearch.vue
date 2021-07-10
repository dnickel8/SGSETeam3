<template>
  <CatalogSearch />
</template>

<script>
// @ is an alias to /src
import CatalogSearch from "@/catalog_service/components/catalogSearch.vue";

export default {
  name: "CatalogSearchView",
  components: {
    CatalogSearch,
  },
};
</script>
