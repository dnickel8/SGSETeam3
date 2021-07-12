import axios from "axios";

class CatalogService {
  constructor() {}

  async getData() {
    return await axios.get(`${process.env.VUE_APP_CATALOG_SERVICE_URL}/getAll`);
  }
}

export default new CatalogService();
