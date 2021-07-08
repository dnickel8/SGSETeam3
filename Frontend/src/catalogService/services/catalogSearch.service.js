import axios from "axios";

class CatalogSearchService {
  constructor() {}

  async getData() {
    return await axios.get("http://localhost:3000/getAll");
  }
  async getCategory() {
    return await axios.get("http://localhost:3000/getCategory");
  }
  async getManufacturer() {
    return await axios.get("http://localhost:3000/getManufacturer");
  }
  async search(searchterm, bodyData) {
    return await axios({
      method: "post",
      url: "http://localhost:3000/search/" + searchterm + "/",
      data: {
        data: bodyData,
      },
    });
  }
}
export default new CatalogSearchService();
