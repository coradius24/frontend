const { default: apiService } = require("./api/apiService");

class CategoryService {
  async createCategory(data) {
    return apiService.post(`/api/admin/categories`, data);
  }
  async getCateGory() {
    return apiService.get(`/api/categories`);
  }
  async updateCategory(id, data) {
    return apiService.patch(`/api/admin/categories/${id}`, data);
  }
  async deleteCategory(id) {
    return apiService.delete(`/api/admin/categories/${id}`);
  }
}
export default new CategoryService();
