const { default: apiService } = require("./api/apiService");

class CategoryService {
  async uploadImage() {
    return apiService.get(`/api/categories`);
  }
}
export default new CategoryService();