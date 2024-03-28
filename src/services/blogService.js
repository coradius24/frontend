const { default: apiService } = require("./api/apiService");

class BlogService {
  async getBlogs(filter) {
    return apiService.get(`/api/blogs?${filter || ""}`);
  }
  async getBlogDetails(slug) {
    return apiService.get(`/api/blogs/${slug}`);
  }

  async createBlog(body) {
    return apiService.post(`/api/admin/blogs`, body);
  }

  async updateBlog(id, body) {
    return apiService.post(`/api/admin/blogs/${id}`, body);
  }

  async deleteBlog(id) {
    return apiService.delete(`/api/admin/blogs/${id}`);
  }

  async getCategories(params) {
    return apiService.get(`/api/admin/blogs/categories`, { params });
  }
  async createCategories(body) {
    return apiService.post(`/api/admin/blogs/categories`, body);
  }
  async updateCategories(id) {
    return apiService.patch(`/api/admin/blogs/categories/${id}`);
  }
  async deleteCategories(id) {
    return apiService.delete(`/api/admin/blogs/categories/${id}`);
  }
}
export default new BlogService();
