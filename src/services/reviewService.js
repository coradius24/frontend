const { default: apiService } = require("./api/apiService");

class ReviewService {
  async getFeaturedReview(params) {
    return apiService.get(`/api/reviews/featured`, { params });
  }

  async getReviews(params) {
    return apiService.get(`/api/reviews`, { params });
  }

  async getReviewByAdmin(params) {
    return apiService.get(`/api/admin/reviews`, { params });
  }

  async updateReviewByAdmin(id, updatePayload) {
    const formData = new FormData()
    for (const key in updatePayload) {
      formData.append(key, updatePayload[key]);
    }
    return apiService.patch(`/api/admin/reviews/${id}`, formData, {
      headers: { "content-type": "multipart/form-data" }
    });
  }

  async deleteReview(id) {
    return apiService.delete(`/api/admin/reviews/${id}`);
  }
}
export default new ReviewService();
