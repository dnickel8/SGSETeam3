import axios from "axios";

class CatalogSearchService {
  constructor() {}

  async getData() {
    return await axios.get(`${process.env.VUE_APP_CATALOG_SERVICE_URL}/getAll`);
  }
  async getCategory() {
    return await axios.get(
      `${process.env.VUE_APP_CATALOG_SERVICE_URL}/getCategory`
    );
  }
  async getManufacturer() {
    return await axios.get(
      `${process.env.VUE_APP_CATALOG_SERVICE_URL}/getManufacturer`
    );
  }
  async search(searchterm, bodyData) {
    return await axios({
      method: "post",
      url:
        `${process.env.VUE_APP_CATALOG_SERVICE_URL}/search/` + searchterm + "/",
      data: {
        data: bodyData,
      },
    });
  }
}
export default new CatalogSearchService();
